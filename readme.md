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

- **Staking Token:** [`0xcc55bAdA1F71A8a4D7e19042DF42Dd7521c2D516`](https://sepolia.arbiscan.io/address/0xcc55bAdA1F71A8a4D7e19042DF42Dd7521c2D516)
- **Reward Token:** [`0x77d13F2Fb80fd4deD92F41DbA7d30de5A2a8F889`](https://sepolia.arbiscan.io/address/0x77d13f2fb80fd4ded92f41dba7d30de5a2a8f889)
- **Staking Contract:** [`0x83e4DBD561f91E09FF04466e49cB3ce0c04239a3`](https://sepolia.arbiscan.io/address/0x83e4DBD561f91E09FF04466e49cB3ce0c04239a3)

---

## 🧩 User scenarios

- First, mint some RT tokens (reward tokens) to the ERC20 staking contract.
- Next, mint some ST tokens (staking tokens) to test the staking feature.
- Then, approve the ERC20 staking contract to spend your ST tokens.
- After approval, click the “Stake” button (or call the stake function) to stake your ST tokens.
- Finally, you can unstake your tokens at any time and receive both your ST tokens and earned RT rewards.
