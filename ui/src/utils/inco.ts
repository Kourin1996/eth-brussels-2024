import { ethers } from "ethers";
import { initFhevm, createInstance } from "fhevmjs";

export const FHE_LIB_ADDRESS = "0x000000000000000000000000000000000000005d";

export const createFhevmInstance = async () => {
  await initFhevm();

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const network = await provider.getNetwork();

  console.log("debug::network", network);

  // Get the network's private key
  const ret = await provider.call({
    to: FHE_LIB_ADDRESS,
    data: "0xd9d47bb001",
  });

  const decoded = ethers.AbiCoder.defaultAbiCoder().decode(["bytes"], ret);
  const publicKey = decoded[0];
  const chainId = +network.chainId.toString();

  const instance = await createInstance({ chainId, publicKey });

  console.info("debug::FHEVM instance created", instance);

  return instance;
};
