import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { createInstance } from "../test/instance";

const NFT_ADDRESS = "0xd705ad2882918Fa5C2D8dD7210f4f5C6179fEbAb";

task("task:deployNFTMarket").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const [signer] = await ethers.getSigners();
  const erc20Factory = await ethers.getContractFactory("EncryptedNFTMarket");
  const encryptedNftMarket = await erc20Factory.deploy(NFT_ADDRESS);
  await encryptedNftMarket.waitForDeployment();

  const nftMarketAddress = await encryptedNftMarket.getAddress();
  console.log("EncryptedNFTMarket deployed to: ", nftMarketAddress);

  const instance = await createInstance(nftMarketAddress, ethers, signer, "Encrypted nft");

  const tx = await encryptedNftMarket.register(instance.encrypt32(+0), instance.encrypt32(+1000));

  await tx.wait();

  console.log("registered");
});
