import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { createInstance } from "../test/instance";

const ERC20_ADDRESS = "0x1ec955033Df8fd23d159623F29307E09b405bCb5";
const RECIPIENT_ADDRESS = "0x6f0609f6a920101Faf5A64F6F69BDcf5d4470eC6";

task("task:transfer")
  // .addParam("mint", "Tokens to mint")
  // .addParam("account", "Specify which account [alice, bob, carol, dave]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();

    const encryptedERC20 = await ethers.getContractAt("EncryptedERC20", ERC20_ADDRESS);

    const instance = await createInstance(ERC20_ADDRESS, ethers, signer, "Authorization token");

    const tx = await encryptedERC20.getFunction("transfer(address,bytes)")(
      RECIPIENT_ADDRESS,
      instance.encrypt32(+10000),
    );

    await tx.wait();

    console.log("transfered");
  });
