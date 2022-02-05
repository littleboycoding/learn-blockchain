// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Not really NFT (cause I'm not yet learn about ERC721), just producing NFT alike to be use with token.

import "hardhat/console.sol";

interface TokenInterface {
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success);
}

// BWT can I use AccessControl contract library from OpenZeppelin ?

contract NFT {
    address minter;

    address[] accessible;
    string content;
    uint256 price;

    modifier Accessible() {
        if (minter == msg.sender) {
            _;
            return;
        }

        for (uint256 i = 0; i < accessible.length; i++) {
            if (accessible[i] == msg.sender) {
                _;
                return;
            }
        }
        revert("Not accessible");
    }

    constructor(string memory _content, uint256 _price) {
        minter = msg.sender;
        content = _content;
        price = _price;
    }

    function grant(address _grantTo) public {
        require(msg.sender == minter, "Not allowed");

        accessible.push(_grantTo);
    }

    function read() public view Accessible returns (string memory) {
        return content;
    }
}
