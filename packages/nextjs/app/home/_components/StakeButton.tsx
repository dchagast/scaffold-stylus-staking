"use client";

import { useAccount } from "wagmi";
import { useState } from "react";
import { ActionButton } from "./ActionButton";
import { useScaffoldReadContract, useScaffoldWriteContract, useDeployedContractInfo } from "~~/hooks/scaffold-eth";

export const StakeButton = ({
  error,
  maxAmount,
  stakeAmount,
  isDarkMode,
}: {
  error: boolean;
  stakeAmount: bigint;
  maxAmount: bigint;
  isDarkMode: boolean;
}) => {
  const { address: walletAddress } = useAccount();
  const { data: stakingContractData } = useDeployedContractInfo({
    contractName: "ERC20Staking",
  });

  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    refetch: refetchAllowanceQuery,
  } = useScaffoldReadContract({
    contractName: "StakingToken",
    functionName: "allowance",
    args: [walletAddress, stakingContractData?.address],
  });
  const allowanceBal = allowance || 0n;
  const isApproved = allowanceBal > 0n && allowanceBal >= stakeAmount;

  console.log(`====> allowance: ${allowance}, stakeAmount: ${stakeAmount}`);

  const { writeContractAsync: stakingTokenContractAsync } = useScaffoldWriteContract({
    contractName: "StakingToken",
  });

  const { writeContractAsync: stakingContractAsync } = useScaffoldWriteContract({
    contractName: "ERC20Staking",
  });

  const [isApproveTxLoading, setIsApproveTxLoading] = useState(false);
  const [isStakeTxLoading, setIsStakeTxLoading] = useState(false);

  if (!isApproved) {
    return (
      <ActionButton
        disabled={error || stakeAmount === BigInt(0) || stakeAmount > maxAmount}
        label={isApproveTxLoading ? "Approving" : "Approve"}
        gradientFrom={isDarkMode ? "#30B4ED" : "#3B82F6"}
        gradientTo={isDarkMode ? "#E3066E" : "#EC4899"}
        onClick={async () => {
          setIsApproveTxLoading(true);

          try {
            await stakingTokenContractAsync({
              functionName: "approve",
              args: [stakingContractData?.address, stakeAmount],
            });

            await refetchAllowanceQuery();
          } catch (e) {
            console.error("failed while approving:", e);
          }

          setIsApproveTxLoading(false);
        }}
      />
    );
  }

  return (
    <ActionButton
      disabled={error || stakeAmount === BigInt(0) || stakeAmount > maxAmount}
      label={isStakeTxLoading ? "Staking" : "Stake"}
      gradientFrom={isDarkMode ? "#30B4ED" : "#3B82F6"}
      gradientTo={isDarkMode ? "#E3066E" : "#EC4899"}
      onClick={async () => {
        setIsStakeTxLoading(true);

        try {
          await stakingContractAsync({
            functionName: "stake",
            args: [stakeAmount],
          });
        } catch (e) {
          console.error("failed while approving:", e);
        }

        setIsStakeTxLoading(false);
      }}
    />
  );
};
