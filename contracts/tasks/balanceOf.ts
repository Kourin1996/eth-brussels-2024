import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { createInstance, getReencryptPublicKey } from "../test/instance";

const ERC20_ADDRESS = "0xe6876af3d45Ca7E2b01C49ED4999c07c63B36D00";

task("task:balanceOf").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { ethers } = hre;
  const [signer] = await ethers.getSigners();

  const encryptedERC20 = await ethers.getContractAt("EncryptedERC20", ERC20_ADDRESS);

  const instance = await createInstance(ERC20_ADDRESS, ethers, signer, "Authorization token");

  const { publicKey, signature } =
    (await getReencryptPublicKey(instance, signer, ERC20_ADDRESS, "Authorization token")) ?? {};

  const encryptedBalance = await encryptedERC20.balanceOf(publicKey!, signature!);
  const balance = await instance.decrypt(ERC20_ADDRESS, encryptedBalance);

  console.log("balance", balance);
});
