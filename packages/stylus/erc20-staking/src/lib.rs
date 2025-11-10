#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

use alloc::vec::Vec;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
    storage::{StorageMap, StorageU256, StorageAddress}
};

use alloy_sol_types::sol;

sol_interface! {
    interface IERC20 {
        function balanceOf(address owner) external view returns (uint);
        function transferFrom(address from, address to, uint256 value) external;
        function transfer(address to, uint256 value) external;
    }
}

sol! {
    // -------------------- Errors --------------------
    #[derive(Debug)]
    error InvalidStakingToken(address stakingToken);
    #[derive(Debug)]
    error InvalidRewardToken(address rewardToken);
    #[derive(Debug)]
    error InvalidRewardRate(uint256 rewardRate);
    #[derive(Debug)]
    error InvalidStakeAmount(uint256 amount);
    #[derive(Debug)]
    error NoActiveStake();
    #[derive(Debug)]
    error NoOwedReward();
    #[derive(Debug)]
    error ERC20TransferFailed(bytes string);
    #[derive(Debug)]
    error InsufficientRewardTokens(uint256 deficit);
    #[derive(Debug)]
    error ZeroRewardGenerated();

    // -------------------- Events --------------------
    event STTokensStaked(address indexed staker, uint256 stakeAmount, uint256 rewardAccrued);
    event STTokensUnstaked(address indexed staker, uint256 unstakeAmount, uint256 rewardsPaid);
}

#[derive(SolidityError, Debug)]
pub enum Error {
    InvalidStakingToken(InvalidStakingToken),
    InvalidRewardToken(InvalidRewardToken),
    InvalidRewardRate(InvalidRewardRate),
    InvalidStakeAmount(InvalidStakeAmount),
    NoActiveStake(NoActiveStake),
    NoOwedReward(NoOwedReward),
    ERC20TransferFailed(ERC20TransferFailed),
    InsufficientRewardTokens(InsufficientRewardTokens),
    ZeroRewardGenerated(ZeroRewardGenerated),
}


#[entrypoint]
#[storage]
struct ERC20Staking {
    // Reward parameters
    reward_divisor: StorageU256,            // Fixed-point divisor (e.g., 1000)
    reward_rate: StorageU256,               // Reward rate applied per stake

    // Global accounting
    total_reserved_rewards: StorageU256,    // Total rewards allocated but not yet paid

    // ERC20 token references
    staking_token: StorageAddress,             // Token users stake
    reward_token: StorageAddress,              // Token distributed as rewards

    // Per-user accounting
    user_staked_balance: StorageMap<Address, StorageU256>,  // Amount of tokens staked by user
    user_reward_balance: StorageMap<Address, StorageU256>,  // Accumulated (unclaimed) rewards
}

#[public]
impl ERC20Staking {
    #[constructor]
    pub fn constructor(
        &mut self,
        staking_token: Address,
        reward_token: Address,
        reward_rate: U256,
    ) -> Result<(), Error> {
        // Validate input parameters
        if staking_token.is_zero() {
            return Err(Error::InvalidStakingToken(InvalidStakingToken { stakingToken: staking_token }));
        }
        if reward_token.is_zero() {
            return Err(Error::InvalidRewardToken(InvalidRewardToken { rewardToken: reward_token }));
        }
        if reward_rate.is_zero() || reward_rate > U256::from(1000) {
            return Err(Error::InvalidRewardRate(InvalidRewardRate { rewardRate: reward_rate }));
        }

        // Initialize storage
        self.staking_token.set(staking_token);
        self.reward_token.set(reward_token);
        self.reward_rate.set(reward_rate);
        self.reward_divisor.set(U256::from(1000));

        Ok(())
    }

    pub fn stakeTokens(&mut self, amount: U256) -> Result<(), Error> {
        let sender = self.vm().msg_sender();
        let contract_addr = self.vm().contract_address();

        if amount.is_zero() {
            return Err(Error::InvalidStakeAmount(InvalidStakeAmount { amount }));
        }

        // Calculate proportional reward
        let reward = amount * self.reward_rate.get() / self.reward_divisor.get();
        if reward.is_zero() {
            return Err(Error::ZeroRewardGenerated(ZeroRewardGenerated {}));
        }

        // Ensure contract reward pool can cover future rewards
        let total_reserved = self.total_reserved_rewards.get() + reward;
        let available_reward_balance = IERC20::new(self.reward_token.get()).balance_of(&*self, contract_addr).unwrap();

        if total_reserved > available_reward_balance {
            let deficit = total_reserved - available_reward_balance;
            return Err(Error::InsufficientRewardTokens(InsufficientRewardTokens { deficit }));
        }

        // Update accounting
        self.total_reserved_rewards.set(total_reserved);

        let previous_stake = self.user_staked_balance.get(sender);
        self.user_staked_balance.insert(sender, previous_stake + amount);

        let previous_reward = self.user_reward_balance.get(sender);
        self.user_reward_balance.insert(sender, previous_reward + reward);

        // Transfer tokens in
        let _ = IERC20::new(self.staking_token.get()).transfer_from(
            &mut *self,
            sender,
            contract_addr,
            amount
        );

        // Emit event
        log(self.vm(), STTokensStaked {
            staker: sender,
            stakeAmount: amount,
            rewardAccrued: reward
        });

        Ok(())
    }

    pub fn unstakeTokens(&mut self) -> Result<(), Error> {
        let sender = self.vm().msg_sender();
        let contract_addr = self.vm().contract_address();

        let staked_amount = self.user_staked_balance.get(sender);
        if staked_amount.is_zero() {
            return Err(Error::NoActiveStake(NoActiveStake {}));
        }

        let reward_owed = self.user_reward_balance.get(sender);
        if reward_owed.is_zero() {
            return Err(Error::NoOwedReward(NoOwedReward {}));
        }

        let available_reward_balance = IERC20::new(self.reward_token.get()).balance_of(&*self, contract_addr).unwrap();
        if reward_owed > available_reward_balance || available_reward_balance.is_zero() {
            return Err(Error::InsufficientRewardTokens(InsufficientRewardTokens { deficit: reward_owed - available_reward_balance }));
        }

        {
            let _ = IERC20::new(self.reward_token.get()).transfer(&mut *self, sender, reward_owed);
        }
        {
            let _ = IERC20::new(self.staking_token.get()).transfer(&mut *self, sender, staked_amount);
        }
        

        // Adjust global totals
        let updated_total = self.total_reserved_rewards.get() - reward_owed;
        self.total_reserved_rewards.set(updated_total);

        // Reset user data
        self.user_staked_balance.insert(sender, U256::ZERO);
        self.user_reward_balance.insert(sender, U256::ZERO);

        // Emit event
        log(self.vm(), STTokensUnstaked {
            staker: sender,
            unstakeAmount: staked_amount,
            rewardsPaid: reward_owed
        });

        Ok(())
    }
    
    pub fn query_user_info(&self, owner: Address) -> (U256, U256, Address) {
        let reward_owed = self.user_reward_balance.get(owner);
        let staked_amount = self.user_staked_balance.get(owner);

        (reward_owed, staked_amount, owner)
    }

    pub fn configuration(&self) -> (Address, Address, U256, U256, U256) {
        (
            self.staking_token.get(),
            self.reward_token.get(),
            self.reward_rate.get(),
            self.reward_divisor.get(),
            self.total_reserved_rewards.get()
        )
    }
}
