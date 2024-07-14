// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.24;

interface IMailbox {
    function dispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody
    ) external payable returns (bytes32 messageId);
}

contract MessageReceiver {
    uint32 public origin;
    bytes32 public sender;
    bytes public message;

    function handle(uint32 _origin, bytes32 _sender, bytes calldata _message) external payable {
        origin = _origin;
        sender = _sender;
        message = _message;
    }
}
