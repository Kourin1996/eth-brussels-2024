// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.24;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/lib/TFHE.sol";

interface IERC20 {
    function transferFrom(address from, address to, bytes calldata encryptedAmount) external;
}

interface IMailbox {
    function dispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody
    ) external payable returns (bytes32 messageId);
}

contract EncryptedNFTMarket is EIP712WithModifier {
    // used for output authorization
    bytes32 private DOMAIN_SEPARATOR;

    // The owner of the contract.
    address public contractOwner;

    // NFT Address in main chain
    address public nftAddress;

    // NFT Index -> Owner
    mapping(uint256 => address) internal ownerByNftIndex;

    // NFT price
    mapping(uint256 => euint32) internal priceByNftIndex;

    // local NFT Index -> NFT ID in main chain
    mapping(uint256 => euint32) internal nftIndexToNftId;

    // current number of NFTs
    uint256 internal numbers;

    uint256 internal nextNftIndex;

    event NFTSold(uint256 nftId, address recipient);
    event MessageSent(uint32 destinationDomain, bytes32 recipientAddress, bytes messageBody);

    constructor(address _nftAddress) EIP712WithModifier("Encrypted nft", "1") {
        contractOwner = msg.sender;
        nftAddress = _nftAddress;

        numbers = 0;
        nextNftIndex = 0;
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner);
        _;
    }

    // debug
    // function getNumber(
    //     bytes32 publicKey,
    //     bytes calldata signature
    // ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
    //     return TFHE.reencrypt(numbers, publicKey, 0);
    // }

    // function getNextNftIndex(
    //     bytes32 publicKey,
    //     bytes calldata signature
    // ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
    //     return TFHE.reencrypt(nextNftId, publicKey, 0);
    // }

    function register(bytes calldata encryptedNftId, bytes calldata encryptedPrice) public onlyContractOwner {
        nftIndexToNftId[numbers] = TFHE.asEuint32(encryptedNftId);
        ownerByNftIndex[numbers] = address(0x0);
        priceByNftIndex[numbers] = TFHE.asEuint32(encryptedPrice);

        numbers += 1;
    }

    function purchase(address erc20Address, bytes calldata encryptedAmount, address recipient) public payable {
        require(nextNftIndex < numbers, "All NFT is sold");

        uint256 nftIndex = nextNftIndex;
        require(ownerByNftIndex[nftIndex] == address(0x0), "Already taken");

        // check amount is greater than price
        TFHE.optReq(TFHE.le(priceByNftIndex[nftIndex], TFHE.asEuint32(encryptedAmount)));

        // register
        ownerByNftIndex[nftIndex] = msg.sender;

        // transfer token
        IERC20 token = IERC20(erc20Address);
        token.transferFrom(msg.sender, address(this), encryptedAmount);

        // Send message to main chain
        uint256 nftId = TFHE.decrypt(nftIndexToNftId[nftIndex]);

        bytes memory body = abi.encode(nftId, uint256(uint160(recipient)));

        // Target is Base Sepolia
        IMailbox mainbox = IMailbox(0x51510C9df44256FE61f391286F81E52A708919db);
        mainbox.dispatch{ value: msg.value }(84532, bytes32(uint256(uint160(nftAddress))), body);

        emit NFTSold(nftId, recipient);
        emit MessageSent(84532, bytes32(uint256(uint160(nftAddress))), body);

        nextNftIndex += 1;
    }
}
