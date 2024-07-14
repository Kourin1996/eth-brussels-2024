# contracts

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

Deploy the ERC20 to Inco Gentry Testnet Network:

```sh
npx hardhat deploy --network inco
```

### Lint Solidity

Lint the Solidity code:

```sh
pnpm lint:sol
```

### Lint TypeScript

```sh
pnpm lint:ts
```

### Tasks

#### Deploy EncryptedERC20

Deploy a new instance of the EncryptedERC20 contract via a task:

```sh
pnpm task:deployERC20
```
