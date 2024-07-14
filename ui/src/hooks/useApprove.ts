import { useCallback } from "react";
import { writeContract } from "@wagmi/core";
import { config } from "../wagmi";
import { createFhevmInstance } from "../utils/inco";
import { INCO_ERC20_ADDRESS } from "../consts/envs";

import ERC20ABI from "../abi/EncryptedERC20.json";
import { toHex } from "viem";

const ALLOWANCE = 20000000;

export const useApprove = (spender: string) => {
  return useCallback(async () => {
    const instance = await createFhevmInstance();

    const encrypted = toHex(await instance.encrypt32(ALLOWANCE));

    console.log("debug::call approve", config, {
      abi: ERC20ABI,
      address: INCO_ERC20_ADDRESS,
      functionName: "approve",
      args: [spender, encrypted],
    });

    const hash = await writeContract(config, {
      abi: ERC20ABI,
      address: INCO_ERC20_ADDRESS,
      functionName: "approve",
      args: [spender, encrypted],
    });

    console.log("debug::wrote contract", hash);

    return hash;
  }, []);
};
