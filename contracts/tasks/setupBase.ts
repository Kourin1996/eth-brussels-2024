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

task("task:setupBase").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const nftFactory = await ethers.getContractFactory("NFT");
  const nft = await nftFactory.deploy("NFT Example", "NFT");
  await nft.waitForDeployment();

  const nftAddress = await nft.getAddress();
  console.log("NFT deployed to: ", nftAddress);

  console.log("minting NFTs...");

  await litClient.connect();

  const res: any[] = [];
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
        contractAddress: nftAddress,
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
        contractAddress: nftAddress,
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

    console.log(`lit(#${i})`, litRes);

    const response = await lighthouse.uploadText(JSON.stringify(litRes), API_KEY, name);
    const hash = response.data.Hash;

    console.log(`ipfs(#${hash})`, response);
    res.push(response.data);

    const tx = await nft.mint(`ipfs://${hash}`);
    console.log(`NFT(#${i}): ${hash}`);
    await tx.wait();
  }

  console.log("done");
  console.log(JSON.stringify(res));
});
