// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract RandomableNFT is
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    Ownable,
    VRFConsumerBaseV2
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // VRF
    VRFCoordinatorV2Interface internal COORDINATOR;
    uint64 internal subscriptionId;
    bytes32 internal keyHash;
    uint32 internal numWords;
    uint32 internal callbackGasLimit;
    uint16 internal requestConfirmation;

    string[] public tokenURIS;

    mapping(uint256 => address) internal requester;

    event RequestRandom(uint256 requestId);

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

    // Should be able to add by anyone and use Governance/Voting to add to main pool instead ? This way this is truly community driven.
    function addToken(string memory _tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        tokenURIS.push(_tokenURI);
        return tokenURIS.length - 1;
    }

    function getRandomToken() public onlyOwner returns (uint256) {
        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmation,
            callbackGasLimit,
            numWords
        );

        requester[requestId] = msg.sender;

        emit RequestRandom(requestId);

        return requestId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory random)
        internal
        override
    {
        address requestBy = requester[requestId];
        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();
        string memory uri = tokenURIS[random[0] % tokenURIS.length];

        _safeMint(requestBy, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
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
