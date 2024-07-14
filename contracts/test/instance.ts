import { Signer } from "ethers";
import fhevmjs, { FhevmInstance } from "fhevmjs";
import { ethers as hethers } from "hardhat";

import { FHE_LIB_ADDRESS } from "./generated";

let publicKey: string;
let chainId: number;

export const createInstance = async (
  contractAddress: string,
  ethers: typeof hethers,
  signer: Signer,
  contractIdentifier: string,
): Promise<FhevmInstance> => {
  if (!publicKey || !chainId) {
    // 1. Get chain id
    const provider = ethers.provider;

    const network = await provider.getNetwork();
    chainId = +network.chainId.toString(); // Need to be a number

    // Get blockchain public key
    const ret = await provider.call({
      to: FHE_LIB_ADDRESS,
      // first four bytes of keccak256('fhePubKey(bytes1)') + 1 byte for library
      data: "0xd9d47bb001",
    });

    const decoded = ethers.AbiCoder.defaultAbiCoder().decode(["bytes"], ret);
    publicKey = decoded[0];
  }

  // Create instance
  const instance = await fhevmjs.createInstance({ chainId, publicKey });

  await generateToken(contractAddress, signer, instance, contractIdentifier);

  return instance;
};

export const generateToken = async (
  contractAddress: string,
  signer: Signer,
  instance: FhevmInstance,
  contractIdentifier: string,
) => {
  // Generate token to decrypt
  const generatedToken = instance.generatePublicKey({
    verifyingContract: contractAddress,
  });

  // Sign the public key
  const signature = await signer.signTypedData(
    {
      ...generatedToken.eip712.domain,
      name: contractIdentifier,
    },
    { Reencrypt: generatedToken.eip712.types.Reencrypt },
    generatedToken.eip712.message,
  );

  instance.setSignature(contractAddress, signature);
};

export const getReencryptPublicKey = async (
  instance: FhevmInstance,
  signer: Signer,
  contractAddress: string,
  contractIdentifier: string,
) => {
  if (!instance.hasKeypair(contractAddress)) {
    await generateToken(contractAddress, signer, instance, contractIdentifier);
  }

  return instance.getPublicKey(contractAddress);
};
