import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:deployNFT").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const [signer] = await ethers.getSigners();
  const nftFactory = await ethers.getContractFactory("NFT");
  const nft = await nftFactory.connect(signer).deploy("NFT Example", "NFT");
  await nft.waitForDeployment();

  const nftAddress = await nft.getAddress();
  console.log("NFT deployed to: ", nftAddress);

  const tx = await nft.mint("hello");
  await tx.wait();

  console.log("NFT minted");
});
