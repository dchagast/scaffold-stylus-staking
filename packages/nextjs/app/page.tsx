"use client";

import type { NextPage } from "next";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";
import { useState } from "react";

import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { BalanceItem } from "./home/_components/BalanceItem";
import { StakeButton } from "./home/_components/StakeButton";
import { UnstakeButton } from "./home/_components/UnstakeButton";
import { SectionCard } from "./home/_components/SectionCard";
import { InfoRow } from "./home/_components/InfoRow";
import { StakingInfo } from "./home/_components/StakingInfo";
import { formatTokenBalanceStr } from "~~/utils/format";

const Home: NextPage = () => {
  const [stakeValue, setStakeValue] = useState("");
  const [stakeAmount, setStakeAmount] = useState<bigint>(0n);
  const [error, setError] = useState(false);

  const { address: walletAddress } = useAccount();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // Read user balances
  const { data: balance, isLoading: isBalanceLoading } = useScaffoldReadContract({
    contractName: "StakingToken",
    functionName: "balanceOf",
    args: [walletAddress],
  });
  const maxVal = balance || BigInt(0);

  const { data: userStakeInfo } = useScaffoldReadContract({
    contractName: "ERC20Staking",
    functionName: "queryUserInfo",
    args: [walletAddress],
  });

  const pendingRewards = userStakeInfo && userStakeInfo.length > 1 ? userStakeInfo[0] : 0n;
  const stakedTokens = userStakeInfo && userStakeInfo.length > 1 ? userStakeInfo[1] : 0n;

  const { data: stakingTokenDecimals } = useScaffoldReadContract({
    contractName: "StakingToken",
    functionName: "decimals",
  });

  const { data: stakingTokenSymbol } = useScaffoldReadContract({
    contractName: "StakingToken",
    functionName: "symbol",
  });

  const { data: rewardTokenDecimals } = useScaffoldReadContract({
    contractName: "RewardToken",
    functionName: "decimals",
  });

  const { data: rewardTokenSymbol } = useScaffoldReadContract({
    contractName: "StakingToken",
    functionName: "symbol",
  });

  const { data: rewards, isLoading: isRewardsLoading } = useScaffoldReadContract({
    contractName: "RewardToken",
    functionName: "balanceOf",
    args: [walletAddress],
  });

  const handleInputChange = (valueString: string) => {
    if (valueString === "") {
      setStakeValue("");
      setStakeAmount(0n);
      return;
    }

    try {
      const numValue = parseFloat(valueString);
      const scaledValue = BigInt(Math.floor(numValue * 10 ** Number(stakingTokenDecimals)));

      if (scaledValue <= maxVal) {
        setStakeAmount(scaledValue);
        setStakeValue(valueString);
      }
    } catch (e) {
      console.error("Error in handleInputChange:", e);
      setError(true);
    }
  };

  return (
    <div
      className={`flex flex-col items-center min-h-screen px-6 py-10 ${
        isDarkMode
          ? "bg-gradient-to-b from-[#050505] via-[#0b0b0b] to-[#151515]"
          : "bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#f1f5f9]"
      }`}
    >
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        <SectionCard title="User Overview" emoji="👤" isDarkMode={isDarkMode}>
          <div className="flex flex-col gap-4">
            <InfoRow label="Connected Wallet:" value={<Address address={walletAddress} />} dark={isDarkMode} />
            <div className="grid grid-cols-2 gap-3">
              <BalanceItem
                label="Staking Token Balance"
                value={
                  isBalanceLoading
                    ? "Loading..."
                    : formatTokenBalanceStr(balance, stakingTokenDecimals, stakingTokenSymbol)
                }
                dark={isDarkMode}
              />
              <BalanceItem
                label="Reward Token Balance"
                value={
                  isRewardsLoading
                    ? "Loading..."
                    : formatTokenBalanceStr(rewards, rewardTokenDecimals, rewardTokenSymbol)
                }
                dark={isDarkMode}
              />
              <BalanceItem
                label="Staked Balance"
                value={
                  isBalanceLoading
                    ? "Loading..."
                    : formatTokenBalanceStr(stakedTokens, rewardTokenDecimals, rewardTokenSymbol)
                }
                dark={isDarkMode}
              />
              <BalanceItem
                label="Pending Reward"
                value={
                  isRewardsLoading
                    ? "Loading..."
                    : formatTokenBalanceStr(pendingRewards, rewardTokenDecimals, rewardTokenSymbol)
                }
                dark={isDarkMode}
              />
            </div>
          </div>
        </SectionCard>

        <StakingInfo rewardTokenDecimals={rewardTokenDecimals} rewardTokenSymbol={rewardTokenSymbol} />
      </div>

      <div
        className={`w-full max-w-6xl mt-10 rounded-3xl border p-8 shadow-lg transition-all duration-300 ${
          isDarkMode
            ? "bg-[rgba(30,30,30,0.7)] border-[rgba(255,255,255,0.1)] backdrop-blur-xl"
            : "bg-white border-gray-200"
        }`}
      >
        <h2 className={`text-center text-2xl font-semibold mb-6 ${isDarkMode ? "text-[#30B4ED]" : "text-[#2563EB]"}`}>
          💠 Stake / Unstake
        </h2>

        <div className="flex flex-col gap-4 max-w-lg mx-auto">
          <input
            className={`rounded-xl w-full border px-5 py-3 text-base focus:ring-2 focus:ring-[#30B4ED] outline-none transition-all ${
              isDarkMode
                ? "bg-[rgba(20,20,20,0.9)] border-gray-700 text-gray-100 placeholder-gray-500"
                : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400"
            }`}
            value={stakeValue}
            onChange={(e: any) => {
              handleInputChange(e.target.value);
            }}
            placeholder={`Enter amount to stake, max balance: ${Number(maxVal) / 10 ** Number(stakingTokenDecimals)}`}
            type="number"
            min="0"
          />

          <div className="grid grid-cols-2 gap-4 mt-2">
            <StakeButton error={error} maxAmount={maxVal} stakeAmount={stakeAmount} isDarkMode={isDarkMode} />

            <UnstakeButton pendingRewards={pendingRewards || 0n} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
