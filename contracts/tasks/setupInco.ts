import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { createInstance } from "../test/instance";

const NFT_ADDRESS = "0x20616425CF2f1ed394CD95Ed6759db466CEA77cB";
const ACCOUNT_2_ADDRESS = "0x6f0609f6a920101Faf5A64F6F69BDcf5d4470eC6";

task("task:setupInco").setAction(async function (_taskArguments: TaskArguments, { ethers }) {
  const [signer] = await ethers.getSigners();

  // deploy ERC20
  const erc20Factory = await ethers.getContractFactory("EncryptedERC20");
  const encryptedERC20 = await erc20Factory.deploy();
  await encryptedERC20.waitForDeployment();
  const encryptedERC20Address = await encryptedERC20.getAddress();
  console.log("EncryptedERC20 deployed to: ", encryptedERC20Address);

  // deploy NFTMarket
  const nftMarketFactory = await ethers.getContractFactory("EncryptedNFTMarket");
  const encryptedNftMarket = await nftMarketFactory.deploy(NFT_ADDRESS);
  await encryptedNftMarket.waitForDeployment();
  const nftMarketAddress = await encryptedNftMarket.getAddress();
  console.log("EncryptedNFTMarket deployed to: ", nftMarketAddress);

  const instance1 = await createInstance(encryptedERC20Address, ethers, signer, "Authorization token");
  const tx1 = await encryptedERC20.mint(instance1.encrypt32(+20000000));
  await tx1.wait();
  console.log("ERC20 minted");

  const tx2 = await encryptedERC20.getFunction("transfer(address,bytes)")(
    ACCOUNT_2_ADDRESS,
    instance1.encrypt32(+10000000),
  );
  await tx2.wait();
  console.log("ERC20 transfered");

  const instance2 = await createInstance(nftMarketAddress, ethers, signer, "Encrypted nft");
  // random IDs
  const nftIds = [6, 3, 2, 4, 0, 5, 7, 1];

  for (let i = 0; i < nftIds.length; i++) {
    const nftId = nftIds[i];

    const tx3 = await encryptedNftMarket.register(instance2.encrypt32(+nftId), instance2.encrypt32(+10000));
    await tx3.wait();

    console.log(`NFT #${nftId} registered`);
  }
});
