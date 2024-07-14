import lighthouse from "@lighthouse-web3/sdk";
import { config as dotenvConfig } from "dotenv";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { resolve } from "path";

const LitJsSdk = require("@lit-protocol/lit-node-client-nodejs");

const metadata = require("../files/metadata.json");
const images = require("../files/images.json");

const litClient = new LitJsSdk.LitNodeClientNodeJs({
  alertWhenUnauthorized: false,
  litNetwork: "cayenne",
  debug: true,
});

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, "..", dotenvConfigPath) });

const API_KEY = process.env.LIGHT_HOUSE_API_KEY!;
const NFT_CONTRACT_ADDRESS = "0x7285F24074792507DeF2441e31570d1324D3965E";

task("task:uploadMetadata").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const res: any[] = [];

  try {
    await litClient.connect();

    for (let i = 0; i < metadata.length; i++) {
      const name = metadata[i].title;
      const description = metadata[i].description;
      const image = `ipfs://${images[i].Hash}`;
      const data = {
        name,
        description,
        image,
      };

      console.log("data", data);

      const accessControlConditions = [
        {
          contractAddress: NFT_CONTRACT_ADDRESS,
          standardContractType: "ERC721",
          chain: "baseSepolia",
          method: "ownerOf",
          parameters: [i.toString()],
          returnValueTest: {
            comparator: "=",
            value: ":userAddress",
          },
        },
        { operator: "or" },
        {
          contractAddress: NFT_CONTRACT_ADDRESS,
          standardContractType: "ERC721",
          chain: "baseSepolia",
          method: "isPublic",
          parameters: [i.toString()],
          returnValueTest: {
            comparator: "=",
            value: "true",
          },
        },
      ];

      const litRes = await LitJsSdk.encryptString(
        {
          accessControlConditions,
          dataToEncrypt: JSON.stringify(data),
        },
        litClient,
      );

      console.log("litRes", litRes);

      const response = await lighthouse.uploadText(JSON.stringify(litRes), API_KEY, name);

      console.log("response", response);

      res.push(response.data);
    }

    console.log("result", JSON.stringify(res));
  } catch (error) {
    console.error(error);
  }
});
