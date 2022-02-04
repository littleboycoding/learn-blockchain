// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "hardhat/console.sol";

contract Storage {
    address[] token;

    function deploy() public {
        Token newToken = new Token(1 * (10**18));
        token.push(address(newToken));
    }

    function getToken(uint256 index) public view returns (address) {
        return token[index];
    }
}
