import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

const MESSAGE_SENDER_ADDRESS = "0x39d991C6477eC8457AfFDE03d0b4Ca9f44596Bd2";

task("task:emitMessage").setAction(async function (taskArguments: TaskArguments, hre) {
  const { ethers } = hre;

  const messageSender = await ethers.getContractAt("MessageSender", MESSAGE_SENDER_ADDRESS);

  const tx = await messageSender.emitMessage(
    84532,
    "0x83B964EA40E3D74e6Bd9b59579C35F2e096c94A5",
    ethers.toUtf8Bytes("Hello, World!!!"),
  );
  console.log("hash", tx.hash);
  await tx.wait();

  console.log("emited");
});
