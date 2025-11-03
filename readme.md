# 🪙 Stylus Staking Token Contract

A simple ERC20 token staking contract built using [scaffold-stylus](https://arb-stylus.github.io/scaffold-stylus-docs/).  
This contract allows users to stake tokens, earn rewards, and withdraw both their stake and rewards securely.

---

## 📘 Overview

- Stake ERC20 tokens to earn rewards.
- Unstake and receive both staked tokens and accrued rewards.
- Query user staking and reward information.

---

## ⚙️ Deployed Contracts (Arbitrum Sepolia)

- **Staking Token:** [`0xcc55bada1f71a8a4d7e19042df42dd7521c2d516`](https://sepolia.arbiscan.io/address/0xcc55bada1f71a8a4d7e19042df42dd7521c2d516)
- **Reward Token:** [`0x77d13f2fb80fd4ded92f41dba7d30de5a2a8f889`](https://sepolia.arbiscan.io/address/0x77d13f2fb80fd4ded92f41dba7d30de5a2a8f889)
- **Staking Contract:** [`0x980a374761390ac93949bb7ab110c4a8e85eb084`](https://sepolia.arbiscan.io/address/0x980a374761390ac93949bb7ab110c4a8e85eb084)
- **Deployer Address:** [`0x43e104859e33656cce410812638d81ba3138d5c9`](https://sepolia.arbiscan.io/address/0x43e104859e33656cce410812638d81ba3138d5c9)

---

## 🧩 Key Functions

| Function                                                | Description                                                     |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| `constructor(staking_token, reward_token, reward_rate)` | Initializes staking and reward tokens with a fixed reward rate. |
| `stake(amount)`                                         | Stake tokens and accumulate rewards.                            |
| `unstake(to)`                                           | Withdraw staked tokens and rewards.                             |
| `query_user_info(owner)`                                | View user’s staked and reward balances.                         |
| `configuration()`                                       | View current staking configuration.                             |

---

## 🪄 Reward Formula

reward = (stake_amount \* reward_rate) / reward_divisor

Example:  
If `reward_rate = 50` and `reward_divisor = 1000`,  
staking `1000 tokens` gives `50 tokens` as reward (5%).

---

## 🧾 Events

- `Staked(address staker, uint256 stakeAmount, uint256 rewardAccrued)`
- `Unstaked(address staker, address receiver, uint256 unstakeAmount, uint256 rewardsPaid)`

---

## 🧰 Development

This project was created using **scaffold-stylus**.  
To build or deploy:

```bash
cargo stylus build
stylus deploy --network arbitrum-sepolia

```
