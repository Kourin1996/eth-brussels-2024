import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { createInstance } from "../test/instance";

const ERC20_ADDRESS = "0x20b9769431675a91423Eb4fbc481008CF2AF811a";
const NFT_MARKET_ADDRESS = "0xC0AdDE3d77bb929CB282564F0227f6EE092F3e30";

task("task:purchase").setAction(async function (taskArguments: TaskArguments, hre) {
  const { ethers } = hre;
  const [signer] = await ethers.getSigners();

  const erc20 = await ethers.getContractAt("EncryptedERC20", ERC20_ADDRESS);
  const instances1 = await createInstance(ERC20_ADDRESS, ethers, signer, "Authorization token");

  const tx1 = await erc20.approve(NFT_MARKET_ADDRESS, instances1.encrypt32(+10000));
  await tx1.wait();
  console.log("approved");

  const nftMarket = await ethers.getContractAt("EncryptedNFTMarket", NFT_MARKET_ADDRESS);
  const instances2 = await createInstance(NFT_MARKET_ADDRESS, ethers, signer, "Encrypted nft");

  const tx2 = await nftMarket.purchase(ERC20_ADDRESS, instances2.encrypt32(+10000), await signer.getAddress());
  await tx2.wait();
  console.log("purchased");
});
