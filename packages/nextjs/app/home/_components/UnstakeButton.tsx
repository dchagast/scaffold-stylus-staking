"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";

import { ActionButton } from "./ActionButton";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const UnstakeButton = ({ pendingRewards }: { pendingRewards: bigint }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const { writeContractAsync: stakingContractAsync } = useScaffoldWriteContract({
    contractName: "ERC20Staking",
  });

  const [unstakeIsLoding, setUnstakeIsLoading] = useState(false);
  const { address: walletAddress } = useAccount();

  return (
    <ActionButton
      onClick={async () => {
        setUnstakeIsLoading(true);

        try {
          await stakingContractAsync({
            functionName: "unstake",
            args: [walletAddress],
          });
        } catch (e) {
          console.error("failed while unstaking:", e);
        }

        setUnstakeIsLoading(false);
      }}
      label={unstakeIsLoding ? "Unstaking" : "Unstake"}
      outline={true}
      dark={isDarkMode}
      disabled={pendingRewards == 0n}
    />
  );
};
