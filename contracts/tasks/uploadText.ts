import lighthouse from "@lighthouse-web3/sdk";
import { config as dotenvConfig } from "dotenv";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { resolve } from "path";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, "..", dotenvConfigPath) });

const API_KEY = process.env.LIGHT_HOUSE_API_KEY!;

task("task:uploadText").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const text = "Sometimes, I Wish I Was A Cloud, Just Floating Along";
  const name = "shikamaru";

  const response = await lighthouse.uploadText(text, API_KEY, name);

  console.log(response);
});
