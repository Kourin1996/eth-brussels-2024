# contracts

Smart contracts written in Solidity

## Usage

### Pre Requisites

```sh
cp .env.example .env
```

Then, proceed with installing dependencies:

```sh
pnpm install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
npx hardhat compile
```

### Deploy

Deploy NFT contract into Base Sepolia

```sh
npx hardhat task:setupBase --network baseSepolia
```

Deploy confidential ERC20 and NFTMarketPlace contract into Inco Gentry

```sh
npx hardhat task:setupInco --network incoGentry
```

### Setup NFT Metadata

Upload images into Lighthouse

```sh
npx hardhat task:uploadImages
```

Upload encrypted NFT metadata into Lighthouse

```sh
npx hardhat task:uploadMetadata
```