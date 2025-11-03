"use client";

import { useTheme } from "next-themes";

import { SectionCard } from "./SectionCard";
import { InfoRow } from "./InfoRow";
import { BalanceItem } from "./BalanceItem";
import { Address } from "~~/components/scaffold-eth";
import { formatTokenBalanceStr } from "~~/utils/format";

import { useScaffoldReadContract, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { ZERO_ADDRESS } from "~~/utils/scaffold-eth/common";

interface Props {
  rewardTokenSymbol: string | undefined;
  rewardTokenDecimals: number | undefined;
}

export const StakingInfo = ({ rewardTokenSymbol, rewardTokenDecimals }: Props) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // Read user balances
  const { data: configurationData, isLoading: isConfigurationDataLoading } = useScaffoldReadContract({
    contractName: "ERC20Staking",
    functionName: "configuration",
  });

  const { data: deployedContractData } = useDeployedContractInfo({
    contractName: "ERC20Staking",
  });

  return (
    <SectionCard title="Contract Information" emoji="📜" isDarkMode={isDarkMode}>
      {isConfigurationDataLoading ? (
        <p className="text-sm text-gray-400 animate-pulse text-center">Loading contract data...</p>
      ) : (
        <div className="flex flex-col gap-3">
          <InfoRow
            label="Staking Contract:"
            value={<Address address={deployedContractData?.address} />}
            dark={isDarkMode}
          />
          <InfoRow
            label="Staking Token:"
            value={<Address address={configurationData ? configurationData[0] : ZERO_ADDRESS} />}
            dark={isDarkMode}
          />
          <InfoRow
            label="Reward Token:"
            value={<Address address={configurationData ? configurationData[1] : ZERO_ADDRESS} />}
            dark={isDarkMode}
          />
          <div className="grid grid-cols-2 gap-3">
            <BalanceItem
              label="Reward Rate"
              dark={isDarkMode}
              value={
                configurationData ? `${(Number(configurationData[2]) * 100) / Number(configurationData[3])}%` : "-"
              }
            />
            <BalanceItem
              label="Total reserved rewards"
              dark={isDarkMode}
              value={
                configurationData
                  ? formatTokenBalanceStr(configurationData[4], rewardTokenDecimals, rewardTokenSymbol)
                  : "-"
              }
            />
          </div>
        </div>
      )}
    </SectionCard>
  );
};
