import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { type Chain } from "viem";
import { WC_PROJECT_ID } from "./consts/envs";

export const inco = {
  id: 9090,
  name: "Inco Gentry Testnet",
  nativeCurrency: { name: "INCO", symbol: "INCO", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet.inco.org"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://explorer.testnet.inco.org" },
  },
  contracts: {},
} as const satisfies Chain;

export const config = createConfig({
  chains: [inco, baseSepolia],
  connectors: [injected(), coinbaseWallet(), walletConnect({ projectId: WC_PROJECT_ID })],
  transports: {
    [inco.id]: http(),
    [baseSepolia.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const INCO_CHAIN_ID = inco.id;

export const BASE_SEPOLIA_CHAIN_ID = baseSepolia.id;
