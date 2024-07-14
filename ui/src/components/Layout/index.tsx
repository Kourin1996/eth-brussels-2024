import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div style={{ padding: "20px 40px", display: "flex", justifyContent: "flex-end" }}>
        <ConnectButton />
      </div>
      <div>{children}</div>
    </div>
  );
};
