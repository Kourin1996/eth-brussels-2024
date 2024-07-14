import { Signer } from "ethers";
import { FhevmInstance } from "fhevmjs";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { createInstance, getReencryptPublicKey } from "../test/instance";

const NFT_MARKET_ADDRESS = "0xaB3622E1278447666aFBE815576e3eCe4EA9FB4d";

task("task:getNumber")
  // .addParam("mint", "Tokens to mint")
  // .addParam("account", "Specify which account [alice, bob, carol, dave]")
  .setAction(async function (_taskArguments: TaskArguments, hre) {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();

    const encryptedNftMarket = await ethers.getContractAt("EncryptedNFTMarket", NFT_MARKET_ADDRESS);

    const instance = await createInstance(NFT_MARKET_ADDRESS, ethers, signer, "Encrypted nft");
    const { publicKey, signature } =
      (await getReencryptPublicKey(instance, signer, NFT_MARKET_ADDRESS, "Encrypted nft")) ?? {};

    const encryptedNumber = await encryptedNftMarket.getNumber(publicKey!, signature!);
    const number = await instance.decrypt(NFT_MARKET_ADDRESS, encryptedNumber);
    console.log("number", number);

    const encryptedNextId = await encryptedNftMarket.getNextNftId(publicKey!, signature!);
    const nextId = await instance.decrypt(NFT_MARKET_ADDRESS, encryptedNextId);
    console.log("nextId", nextId);
  });
