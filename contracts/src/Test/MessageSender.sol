// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.24;

import "fhevm/abstracts/EIP712WithModifier.sol";

interface IMailbox {
    function dispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody
    ) external payable returns (bytes32 messageId);
}

contract MessageSender is EIP712WithModifier {
    // used for output authorization
    bytes32 private DOMAIN_SEPARATOR;

    constructor() EIP712WithModifier("Authorization token", "1") {}

    function emitMessage(
        uint32 destinationDomain,
        address recipientAddress,
        bytes calldata messageBody
    ) public payable {
        IMailbox mainbox = IMailbox(0x51510C9df44256FE61f391286F81E52A708919db);
        mainbox.dispatch{ value: msg.value }(
            destinationDomain,
            bytes32(uint256(uint160(recipientAddress))),
            messageBody
        );
    }
}
