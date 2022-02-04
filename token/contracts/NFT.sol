// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Not really NFT, just producing NFT alike to be use with token.

import "hardhat/console.sol";

contract NFT {
    address minter;
    address token;

    address[] accessible;
    string content;

    modifier Accessible() {
        for (uint256 i = 0; i < accessible.length; i++) {
            if (accessible[i] == msg.sender) {
                _;
                return;
            }
        }
        revert("Not accessible");
    }

    constructor(string memory _content, address _token) {
        minter = msg.sender;
        content = _content;
        token = _token;
    }

    function _access() public payable {
        // 1 ETH
        require(msg.value >= (1 * (10**18)), "Not enough fund");
        accessible.push(msg.sender);
    }

    function access() public payable {
        (bool success, ) = token.call(
            abi.encodeWithSignature(
                "transfer(address _to, uint256 _value) public returns (bool success)",
                "call transfer",
                msg.sender,
                1 * (10**18)
            )
        );

        require(success);

        accessible.push(msg.sender);
    }

    function read() public view Accessible returns (string memory) {
        return content;
    }
}
