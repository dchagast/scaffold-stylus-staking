import deployStylusContract from "./deploy_contract";
import {
  getDeploymentConfig,
  getRpcUrlFromChain,
  printDeployedAddresses,
  getContractData,
} from "./utils/";
import { DeployOptions } from "./utils/type";
import { config as dotenvConfig } from "dotenv";
import * as path from "path";
import * as fs from "fs";

const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  dotenvConfig({ path: envPath });
}

/**
 * Define your deployment logic here
 */
export default async function deployScript(deployOptions: DeployOptions) {
  const config = getDeploymentConfig(deployOptions);

  console.log(`📡 Using endpoint: ${getRpcUrlFromChain(config.chain)}`);
  if (config.chain) {
    console.log(`🌐 Network: ${config.chain?.name}`);
    console.log(`🔗 Chain ID: ${config.chain?.id}`);
  }
  console.log(`🔑 Using private key: ${config.privateKey.substring(0, 10)}...`);
  console.log(`📁 Deployment directory: ${config.deploymentDir}`);
  console.log(`\n`);

  // deploy staking token
  await deployStylusContract({
    contract: "erc20-example",
    name: "StakingToken",
    constructorArgs: ["StakingToken", "ST", "1000000000000000000000000"],
    ...deployOptions,
  });

  await deployStylusContract({
    contract: "erc20-example",
    name: "RewardToken",
    constructorArgs: ["RewardToken", "RT", "1000000000000000000000000"],
    ...deployOptions,
  });

  const stakingTokenData = getContractData(
    config.chain.id.toString(),
    "StakingToken",
  );
  const stakingTokenAddress = stakingTokenData.address;

  const rewardTokenData = getContractData(
    config.chain.id.toString(),
    "RewardToken",
  );
  const rewardTokenDataAddress = rewardTokenData.address;

  console.log(
    `stakingToken address: ${stakingTokenAddress}, rewardToken address: ${rewardTokenDataAddress}`,
  );

  await deployStylusContract({
    contract: "erc20-staking",
    name: "ERC20Staking",
    constructorArgs: [
      stakingTokenAddress, // stakingTokenAddress,
      rewardTokenDataAddress, // rewardTokenDataAddress,
      10, // 1%
    ],

    ...deployOptions,
  });

  // Print the deployed addresses
  console.log("\n\n");
  printDeployedAddresses(config.deploymentDir, config.chain?.id.toString());
}
