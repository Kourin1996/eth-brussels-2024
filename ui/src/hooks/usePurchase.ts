import { useCallback } from "react";
import { writeContract } from "@wagmi/core";
import { config } from "../wagmi";
import { createFhevmInstance } from "../utils/inco";
import { INCO_ERC20_ADDRESS, INCO_NFT_MARKET_ADDRESS } from "../consts/envs";

import NFTMarketABI from "../abi/EncryptedNFTMarket.json";
import { toHex } from "viem";

const AMOUNT = 10000;

export const usePurchase = (receiver: string) => {
  return useCallback(async () => {
    const instance = await createFhevmInstance();

    const encryptedAmount = toHex(await instance.encrypt32(AMOUNT));

    const hash = await writeContract(config, {
      abi: NFTMarketABI,
      address: INCO_NFT_MARKET_ADDRESS,
      functionName: "purchase",
      args: [INCO_ERC20_ADDRESS, encryptedAmount, receiver],
    });

    console.log("debug::wrote contract", hash);

    return hash;
  }, []);
};
