import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:deployReceiver").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const [signer] = await ethers.getSigners();
  const messageReceiverFactory = await ethers.getContractFactory("MessageReceiver");
  const messageReceiver = await messageReceiverFactory.connect(signer).deploy();
  await messageReceiver.waitForDeployment();
  const messageReceiverAddress = await messageReceiver.getAddress();
  console.log("MessageReceiver deployed to: ", messageReceiverAddress);
});
