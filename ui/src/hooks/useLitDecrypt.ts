import { useCallback } from "react";
import { ethers } from "ethers";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import {
  LitAccessControlConditionResource,
  LitAbility,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LitNetwork } from "@lit-protocol/constants";
import { BASE_NFT_ADDRESS } from "../consts/envs";

const litNodeClient = new LitJsSdk.LitNodeClient({
  alertWhenUnauthorized: false,
  litNetwork: "cayenne",
  debug: true,
});

LitJsSdk.disconnectWeb3();

const chain = "baseSepolia";

async function getSessionSignatures() {
  // Connect to the wallet
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  console.log("debug::accounts", accounts);

  const signer = await provider.getSigner();
  const walletAddress = ethers.getAddress(accounts[0]);

  console.log("Connected account:", walletAddress, signer);

  // Get the latest blockhash
  const latestBlockhash = await litNodeClient.getLatestBlockhash();

  // Define the authNeededCallback function
  const authNeededCallback = async (params: any) => {
    // Create the SIWE message
    const toSign = await createSiweMessageWithRecaps({
      uri: params.uri,
      expiration: params.expiration,
      resources: params.resourceAbilityRequests,
      walletAddress: walletAddress,
      nonce: latestBlockhash,
      litNodeClient: litNodeClient,
    });

    // Generate the authSig
    const authSig = await generateAuthSig({
      signer: signer,
      toSign,
    });

    return authSig;
  };

  // Define the Lit resource
  const litResource = new LitAccessControlConditionResource("*");

  // Get the session signatures
  const sessionSigs = await litNodeClient.getSessionSigs({
    chain,
    resourceAbilityRequests: [
      {
        resource: litResource,
        ability: LitAbility.AccessControlConditionDecryption,
      },
    ],
    authNeededCallback,
  });

  return sessionSigs;
}

const createAccessControlConditions = (nftContractAddress: string, nftId: number) => {
  return [
    {
      contractAddress: nftContractAddress,
      standardContractType: "ERC721",
      chain: "baseSepolia",
      method: "ownerOf",
      parameters: [nftId.toString()],
      returnValueTest: {
        comparator: "=",
        value: ":userAddress",
      },
    },
  ];
};

export const useLitDecrypt = () => {
  return useCallback(async (ciphertext: string, dataToEncryptHash: string, nftId: string) => {
    await litNodeClient.connect();

    console.log("debug::connected");

    const sessionSigs = await getSessionSignatures();

    console.log("debug::signatures", sessionSigs);

    const decryptedString = await LitJsSdk.decryptToString(
      {
        accessControlConditions: createAccessControlConditions(BASE_NFT_ADDRESS, Number.parseInt(nftId, 16)),
        chain,
        ciphertext,
        dataToEncryptHash,
        sessionSigs,
      },
      litNodeClient,
    );

    console.log("debug::decrypted", decryptedString);

    return decryptedString;
  }, []);
};
