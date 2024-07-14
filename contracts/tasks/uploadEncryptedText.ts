import lighthouse from "@lighthouse-web3/sdk";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

const LitJsSdk = require("@lit-protocol/lit-node-client-nodejs");

const litClient = new LitJsSdk.LitNodeClientNodeJs({
  alertWhenUnauthorized: false,
  litNetwork: "datil-dev",
  debug: true,
});

task("task:uploadEncryptedText").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  try {
    await litClient.connect();

    console.log("connected");

    const accessControlConditions = [
      {
        contractAddress: "0x7285F24074792507DeF2441e31570d1324D3965E",
        standardContractType: "ERC721",
        chain: 84532,
        method: "ownerOf",
        parameters: ["0"],
        returnValueTest: {
          comparator: "=",
          value: ":userAddress",
        },
      },
    ];

    const message = "Hello";

    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions,
        dataToEncrypt: message,
      },
      litClient,
    );

    console.log({ ciphertext, dataToEncryptHash });
  } catch (error) {
    console.log(error);
  }
});
