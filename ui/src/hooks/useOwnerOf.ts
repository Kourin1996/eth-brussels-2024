import { useCallback } from "react";
import { BASE_SEPOLIA_CHAIN_ID, config } from "../wagmi";
import { readContract } from "@wagmi/core";
import NFTABI from "../abi/NFT.json";
import { BASE_NFT_ADDRESS } from "../consts/envs";

export const useOwnerOf = () => {
  return useCallback(async (id: string) => {
    const result = await readContract(config, {
      abi: NFTABI,
      address: BASE_NFT_ADDRESS,
      functionName: "ownerOf",
      args: [id],
      chainId: BASE_SEPOLIA_CHAIN_ID,
    });

    return result;
  }, []);
};
