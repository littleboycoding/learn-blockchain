// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract AdvanceNFT is
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    Ownable,
    VRFConsumerBaseV2
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // VRF
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 subscriptionId;
    bytes32 keyHash;
    uint32 numWords;
    uint32 callbackGasLimit;
    uint16 requestConfirmation;

    mapping(uint256 => address) requester;

    constructor(
        bytes32 _keyHash,
        uint32 _numWords,
        uint32 _callbackGasLimit,
        uint16 _requestConfirmation,
        uint64 _subscriptionId,
        address _vrfCoordinator
    ) ERC721("AdvanceNFT", "ANFT") VRFConsumerBaseV2(_vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        keyHash = _keyHash;
        numWords = _numWords;
        callbackGasLimit = _callbackGasLimit;
        requestConfirmation = _requestConfirmation;
        subscriptionId = _subscriptionId;
    }

    function safeMint(string memory _tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 currentId = _tokenIds.current();
        _tokenIds.increment();
        _safeMint(msg.sender, currentId);
        _setTokenURI(currentId, _tokenURI);

        return currentId;
    }

    function getRandomToken() public returns (uint256) {
        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmation,
            callbackGasLimit,
            numWords
        );

        requester[requestId] = msg.sender;

        return requestId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory random)
        internal
        override
    {
        uint256 tokenId = tokenOfOwnerByIndex(
            owner(),
            random[0] % balanceOf(owner())
        );

        safeTransferFrom(owner(), requester[requestId], tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function getAllTokens() public view returns (string[] memory) {
        uint256 total = totalSupply();
        string[] memory a = new string[](total);

        for (uint256 i = 0; i < total; i++) {
            a[i] = tokenURI(tokenByIndex(i));
        }

        return a;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
