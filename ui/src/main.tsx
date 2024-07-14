import React from "react";
import ReactDOM from "react-dom/client";
import { Buffer } from "buffer";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Router } from "./router.tsx";
import { theme } from "./theme.ts";
import { config } from "./wagmi.ts";

import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";

(globalThis as any).Buffer = Buffer;
window.global ||= window;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ChakraProvider theme={theme}>
            <Router />
          </ChakraProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
