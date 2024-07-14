import lighthouse from "@lighthouse-web3/sdk";
import { config as dotenvConfig } from "dotenv";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { resolve } from "path";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, "..", dotenvConfigPath) });

const API_KEY = process.env.LIGHT_HOUSE_API_KEY!;

const files = ["card1.png", "card2.png", "card3.png", "card4.png", "card5.png", "card6.png", "card7.png", "card8.png"];

task("task:uploadImages").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const res: any = {};

  for (const file of files) {
    const response = await lighthouse.upload(resolve(__dirname, "..", "files", file), API_KEY!);

    res[file] = response.data;
  }

  console.log("res", JSON.stringify(res));
});
