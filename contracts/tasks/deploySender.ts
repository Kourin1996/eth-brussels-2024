import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:deploySender").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const [signer] = await ethers.getSigners();

  // deploy
  const messageSenderFactory = await ethers.getContractFactory("MessageSender");
  const messageSender = await messageSenderFactory.connect(signer).deploy();
  await messageSender.waitForDeployment();
  const messageSenderAddress = await messageSender.getAddress();
  console.log("EncryptedERC20 deployed to: ", messageSenderAddress);
});
