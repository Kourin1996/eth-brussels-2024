import { useNavigate } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button, Center, Container, Heading } from "@chakra-ui/react";
import { Layout } from "../../components/Layout";

const cards = [
  "/card1.png",
  "/card2.png",
  "/card3.png",
  "/card4.png",
  "/card5.png",
  "/card6.png",
  "/card7.png",
  "/card8.png",
];

export const IndexPage = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/purchase");
  };

  return (
    <Layout>
      <div style={{ width: "100%", height: "100%", padding: "40px 0px" }}>
        <Container maxW="xl">
          <Heading textAlign="center" size="3xl">TamateBako</Heading>
          <Heading textAlign="center" as="h6" size="md" style={{ marginTop: "32px", fontWeight: "normal" }}>
            With each purchase, the NFT you receive remains a mystery until the moment of acquisition. Dive in and see
            what unique digital asset you uncover!" "Unleash the Unexpected: Dive into the World of Random NFTs!
          </Heading>
          <Center style={{ marginTop: "80px" }}>
            <Button style={{ background: "#DD6b20", width: "200px", cursor: "pointer" }} onClick={onClick}>
              Purchase a NFT
            </Button>
          </Center>
        </Container>
        <div
          style={{
            margin: "160px auto",
            maxWidth: "80vw",
            marginTop: "120px",
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {cards.map((c) => (
            <Card src1={c} src2="/back1.png" width="200px" />
          ))}
        </div>
      </div>
    </Layout>
  );
};
