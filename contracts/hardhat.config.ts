import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import { config as dotenvConfig } from "dotenv";
import "hardhat-deploy";
import type { HardhatUserConfig } from "hardhat/config";
import { resolve } from "path";

import "./tasks/balanceOf";
import "./tasks/decryptText";
import "./tasks/deployNFT";
import "./tasks/deployReceiver";
import "./tasks/deploySender";
import "./tasks/emitMessage";
import "./tasks/getNumber";
import "./tasks/mint";
import "./tasks/ownerOf";
import "./tasks/purchase";
import "./tasks/register";
import "./tasks/setupBase";
import "./tasks/setupInco";
import "./tasks/transfer";
import "./tasks/uploadEncryptedText";
import "./tasks/uploadImages";
import "./tasks/uploadMetadata";
import "./tasks/uploadText";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const PRIVATE_KEYS = (process.env.PRIVATE_KEYS ?? "").split(",");

const config: HardhatUserConfig = {
  defaultNetwork: "local",
  solidity: {
    version: "0.8.24",
    settings: {
      metadata: {
        bytecodeHash: "none",
      },
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  mocha: {
    timeout: 180000,
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    incoGentry: {
      accounts: PRIVATE_KEYS,
      chainId: 9090,
      url: "https://testnet.inco.org",
    },
    baseSepolia: {
      accounts: PRIVATE_KEYS,
      chainId: 84532,
      url: "https://base-sepolia.g.alchemy.com/v2/vpbGKwtdIbC0uU67wyfDXzJoRJXqQHyY",
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./src",
    tests: "./test",
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
  etherscan: {
    apiKey: {
      incoGentry: "abc",
      baseSepolia: "abc",
    },
    customChains: [
      {
        network: "incoGentry",
        chainId: 9090,
        urls: {
          apiURL: "https://explorer.testnet.inco.org/api",
          browserURL: "https://explorer.testnet.inco.org",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://base-sepolia.blockscout.com/api",
          browserURL: "https://base-sepolia.blockscout.com",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
