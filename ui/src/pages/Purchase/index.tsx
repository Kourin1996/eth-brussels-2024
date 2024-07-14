import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Center,
  Spinner,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
} from "@chakra-ui/react";
import { Layout } from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { useApprove } from "../../hooks/useApprove";
import { INCO_NFT_MARKET_ADDRESS } from "../../consts/envs";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useAccount } from "wagmi";
import { config } from "../../wagmi";
import { ethers } from "ethers";
import NFTMarketABI from "../../abi/EncryptedNFTMarket.json";
import { usePurchase } from "../../hooks/usePurchase";
import { useOwnerOf } from "../../hooks/useOwnerOf";

export const PurchasePage = () => {
  const [approveTxHash, setApproveTxHash] = useState<string | undefined>(undefined);
  const [purchaseTxHash, setPurchaseTxHash] = useState<string | undefined>(undefined);
  const [nftId, setNftId] = useState<string | undefined>(undefined);

  const approve = useApprove(INCO_NFT_MARKET_ADDRESS);
  const purchase = usePurchase("0x65d4Ec89Ce26763B4BEa27692E5981D8CD3A58C7");
  const ownerOf = useOwnerOf();

  const { address } = useAccount();

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 3,
  });

  const isSecond = useRef(false);
  useEffect(() => {
    if (!address) return;
    if (isSecond.current) return;
    isSecond.current = true;
    (async () => {
      console.log("debug::call approve");
      try {
        const approveTxHash = await approve();
        setApproveTxHash(approveTxHash);

        const receipt1 = await waitForTransactionReceipt(config, {
          hash: approveTxHash,
        });

        console.log("debug::receipt1", receipt1);

        setActiveStep(1);

        const purchaseTxHash = await purchase();
        setPurchaseTxHash(purchaseTxHash);

        const receipt2 = await waitForTransactionReceipt(config, {
          hash: purchaseTxHash,
        });
        console.log("debug::receipt2", receipt2);

        setActiveStep(2);

        const nftMarketContract = new ethers.Contract(INCO_NFT_MARKET_ADDRESS, NFTMarketABI);
        const nftSoldEvent = receipt2.logs
          .map((log: any) => {
            try {
              return nftMarketContract.interface.parseLog(log);
            } catch (error) {
              return null;
            }
          })
          .filter((event: any) => event !== null && event.name === "NFTSold")
          .at(0);
        console.log("debug::nftSoldEvent", nftSoldEvent);

        const nftId = "0x" + nftSoldEvent!.args[0].toString(16);
        console.log("debug::nftId", nftId);
        setNftId(nftId);

        await new Promise((resolve) => setTimeout(resolve, 2000));
        setActiveStep(3);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [address]);

  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/view?id=${nftId}`);
  };

  const steps = React.useMemo(() => {
    if (activeStep === 0) {
      return [
        { title: "Approving ERC20 transfer", description: "Approve ERC20 token transfer in Inco" },
        { title: "Purchase NFT in Inco", description: "NFT ID is determined in this step" },
        { title: "Bridge a message to Base Sepolia", description: "Transfer NFT ownership" },
      ];
    }

    if (activeStep === 1) {
      return [
        { title: "Approved ERC20 transfer", description: "Approve ERC20 token transfer in Inco" },
        { title: "Purchasing NFT in Inco", description: "NFT ID is determined in this step" },
        { title: "Bridge a message to Base Sepolia", description: "Transfer NFT ownership" },
      ];
    }

    if (activeStep === 2) {
      return [
        { title: "Approved ERC20 transfer", description: "Approve ERC20 token transfer in Inco" },
        { title: "Purchased NFT in Inco", description: "NFT ID is determined in this step" },
        { title: "Bridging a message to Base Sepolia", description: "Transfer NFT ownership" },
      ];
    }

    if (activeStep === 3) {
      return [
        { title: "Approved ERC20 transfer", description: "Approve ERC20 token transfer in Inco" },
        { title: "Purchased NFT in Inco", description: "NFT ID is determined in this step" },
        { title: "Bridged a message to Base Sepolia", description: "Transfer NFT ownership" },
      ];
    }

    return [];
  }, [activeStep]);

  return (
    <Layout>
      <div style={{ width: "80%", padding: "80px 0px", margin: "auto", maxWidth: "1000px" }}>
        <div style={{ display: "flex", gap: "128px", alignItems: "center", justifyContent: "space-around" }}>
          <img src="/back1.png" style={{ marginTop: "0px", width: "40%", borderRadius: "10%" }} />
          <div style={{ marginTop: "10px", width: "50%", display: "flex", gap: "16px", flexDirection: "column" }}>
            <div>
              <Stepper index={activeStep} orientation="vertical" height="400px" gap="0">
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<Spinner size="sm" />} />
                    </StepIndicator>
                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                      {index === 0 && (
                        <div style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}>
                          {approveTxHash !== undefined && (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`https://explorer.testnet.inco.org/tx/${approveTxHash}`}
                              style={{ textDecoration: "underline" }}
                            >
                              {approveTxHash.substring(0, 16) +
                                " ... " +
                                approveTxHash.substring(approveTxHash.length - 16)}
                            </a>
                          )}
                        </div>
                      )}
                      {index === 1 && (
                        <div style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}>
                          {purchaseTxHash !== undefined && (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`https://explorer.testnet.inco.org/tx/${purchaseTxHash}`}
                              style={{ textDecoration: "underline" }}
                            >
                              {purchaseTxHash.substring(0, 16) +
                                " ... " +
                                purchaseTxHash.substring(purchaseTxHash.length - 16)}
                            </a>
                          )}
                        </div>
                      )}
                      {index === 2 && (
                        <div style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}>
                          {nftId !== undefined && <span>NFT ID: {nftId}</span>}
                        </div>
                      )}
                    </Box>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Center style={{ marginTop: "60px" }}>
            <Button style={{ background: "#DD6b20", width: "200px", cursor: "pointer" }} onClick={onClick}>
              Check NFT
            </Button>
          </Center>
        </div>
      </div>
    </Layout>
  );
};
