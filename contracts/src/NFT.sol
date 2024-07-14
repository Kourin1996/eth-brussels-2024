pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string) public uris;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(string memory tokenURI) external onlyOwner {
        uint256 newTokenId = _tokenIds.current();
        uris[newTokenId] = tokenURI;
        _tokenIds.increment();
    }

    // message from inco
    function handle(uint32 _origin, bytes32 _sender, bytes calldata _message) external payable {
        (uint256 nftId, uint256 rawAddress) = abi.decode(_message, (uint256, uint256));
        address recipient = address(uint160(rawAddress));

        _mint(recipient, nftId);
        _setTokenURI(nftId, uris[nftId]);
    }
}
