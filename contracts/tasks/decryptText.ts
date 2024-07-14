import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

const {
  LitAccessControlConditionResource,
  LitAbility,
  createSiweMessageWithRecaps,
  generateAuthSig,
} = require("@lit-protocol/auth-helpers");
const LitJsSdk = require("@lit-protocol/lit-node-client-nodejs");

const litClient = new LitJsSdk.LitNodeClientNodeJs({
  alertWhenUnauthorized: false,
  litNetwork: "cayenne",
  debug: true,
});

const text = {
  ciphertext:
    "ib/ikwShgsyjfWuV4pEXeDNvFbHLoYFkrQLvMWvrLubh9sX8VpUc/7iQYXe8upA1lDCRbB3QGSrwFbZWcQw5+xZwlXohpiuiusJw9GpJKCcgiLtqa/TrQX/OSke2rKKfNZsbPhFbraQk2s0dheEUpyAD",
  dataToEncryptHash: "185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969",
};

task("task:decryptText").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  try {
    await litClient.connect();

    console.log("connected");

    const nonce = await litClient.getLatestBlockhash();

    console.log("nonce", nonce);
    const wallet = new ethers.Wallet("<PRIVATE_KEY>");
    const address = await wallet.getAddress();

    const authNeededCallback = async (params) => {
      const toSign = await createSiweMessageWithRecaps({
        uri: params.uri,
        expiration: params.expiration,
        resources: params.resourceAbilityRequests,
        walletAddress: address,
        nonce: nonce,
        litNodeClient: litClient,
      });

      const authSig = await generateAuthSig({
        signer: wallet,
        toSign,
      });

      return authSig;
    };

    const litResource = new LitAccessControlConditionResource("*");

    console.log("litResource", litResource);

    const sessionSigs = await litClient.getSessionSigs({
      chain: "baseSepolia",
      resourceAbilityRequests: [
        {
          resource: litResource,
          ability: LitAbility.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback,
    });

    console.log("sessionSigs", sessionSigs);

    const accessControlConditions = [
      {
        contractAddress: "0x7285F24074792507DeF2441e31570d1324D3965E",
        standardContractType: "ERC721",
        chain: "baseSepolia",
        method: "ownerOf",
        parameters: ["0"],
        returnValueTest: {
          comparator: "=",
          value: ":userAddress",
        },
      },
    ];

    console.log("accessControlConditions", accessControlConditions);

    const decryptedString = await LitJsSdk.decryptToString(
      {
        accessControlConditions,
        chain: "baseSepolia",
        ciphertext: text.ciphertext,
        dataToEncryptHash: text.dataToEncryptHash,
        sessionSigs,
      },
      litClient,
    );

    console.log("decryptedString", decryptedString);
  } catch (error) {
    console.log(error);
  }
});
