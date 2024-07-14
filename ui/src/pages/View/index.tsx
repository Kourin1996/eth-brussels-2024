import React, { useEffect, useRef, useState } from "react";
import { Heading } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { readContract } from "@wagmi/core";
import { Spinner, Skeleton, SkeletonText } from "@chakra-ui/react";
import { Layout } from "../../components/Layout";
import { useLitDecrypt } from "../../hooks/useLitDecrypt";
import { BASE_SEPOLIA_CHAIN_ID, config } from "../../wagmi";
import { BASE_NFT_ADDRESS } from "../../consts/envs";
import NFT_ABI from "../../abi/NFT.json";

export const ViewPage = () => {
  const [searchParams] = useSearchParams();
  const nftId = searchParams.get("id");

  const navigate = useNavigate();
  useEffect(() => {
    if (nftId === null) {
      navigate("/");
    }
  }, []);

  const secondRender = useRef(false);

  const [metadataIpfsHash, setMetadataIpfsHash] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const litDecrypt = useLitDecrypt();

  useEffect(() => {
    if (secondRender.current) return;
    secondRender.current = true;

    (async () => {
      const result: string = await readContract(config, {
        abi: NFT_ABI,
        address: BASE_NFT_ADDRESS,
        args: [nftId],
        functionName: "tokenURI",
        chainId: BASE_SEPOLIA_CHAIN_ID,
      });

      console.log("debug::metadata hash", result);

      const hash = result.substring(7);

      setMetadataIpfsHash(hash);

      const { ciphertext, dataToEncryptHash } = await (
        await fetch(`https://gateway.lighthouse.storage/ipfs/${hash}`)
      ).json();

      console.log("debug::result", { ciphertext, dataToEncryptHash });

      const decrypted = await litDecrypt(ciphertext, dataToEncryptHash, nftId);

      const { name, description, image } = JSON.parse(decrypted);
      setTitle(name);
      setDescription(description);
      setImageUrl(`https://gateway.lighthouse.storage/ipfs/${image.substring(7)}`);

      setLoading(false);
    })();
  }, [nftId]);

  return (
    <Layout>
      <div style={{ width: "80%", padding: "120px 0px", margin: "auto", maxWidth: "1000px" }}>
        <div style={{ display: "flex", gap: "128px", alignItems: "center", justifyContent: "space-around" }}>
          {loading && (
            <div
              style={{
                width: "40%",
                marginBottom: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner size="xl" />
            </div>
          )}
          {!loading && <img src={imageUrl} style={{ marginTop: "0px", width: "40%", borderRadius: "10%" }} />}
          <div style={{ height: "400px", width: "50%", display: "flex", flexDirection: "column", gap: "16px" }}>
            {loading && <Skeleton height="30px" />}
            {!loading && <Heading size="xl">{title}</Heading>}

            {loading && <SkeletonText mt="2" noOfLines={8} spacing="4" skeletonHeight="3" />}
            {!loading && (
              <Heading size="sm" style={{ color: "#cccccc" }}>
                {description}
              </Heading>
            )}

            <div style={{ marginTop: "8px" }}>
              Metadata URL:{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://gateway.lighthouse.storage/ipfs/${metadataIpfsHash}`}
                style={{ textDecoration: "underline" }}
              >{`https://gateway.lighthouse.storage/ipfs/${metadataIpfsHash}`}</a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
