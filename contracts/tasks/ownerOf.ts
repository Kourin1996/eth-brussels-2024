import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

const NFT_ADDRESS = "0xd705ad2882918Fa5C2D8dD7210f4f5C6179fEbAb";

task("task:ownerOf").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { ethers } = hre;

  const nft = await ethers.getContractAt("NFT", NFT_ADDRESS);

  console.log("NFT Address", NFT_ADDRESS);
  for (let i = 0; i < 8; i++) {
    try {
      const owner = await nft.ownerOf(i);
      console.log(`NFT(#${i}) => ${owner}`);
    } catch (error) {}
  }
});
