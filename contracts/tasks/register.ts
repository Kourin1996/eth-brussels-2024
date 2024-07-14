import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { createInstance } from "../test/instance";

const NFT_MARKET_ADDRESS = "0x1ec955033Df8fd23d159623F29307E09b405bCb5";

task("task:register")
  // .addParam("mint", "Tokens to mint")
  // .addParam("account", "Specify which account [alice, bob, carol, dave]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();

    const nftMarket = await ethers.getContractAt("EncryptedNFTMarket", NFT_MARKET_ADDRESS);

    const instance = await createInstance(NFT_MARKET_ADDRESS, ethers, signer, "Encrypted nft");

    const tx = await nftMarket.register(instance.encrypt32(+0), instance.encrypt32(+1000));

    await tx.wait();

    console.log("registered");
  });
