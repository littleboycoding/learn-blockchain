//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract RNG {
    event GetRandomized();

    function getRandomized() public {
        emit GetRandomized();
    }

    function receiveRandomized(string memory _data) public view {
        console.log("Received", _data);
    }
}