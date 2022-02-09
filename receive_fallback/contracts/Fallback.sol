// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Example for number counter

contract Fallback {
    uint256 count = 0;

    // payable is optional
    fallback() external {
        add();
    }

    function getCount() public view returns (uint256) {
        return count;
    }

    function add() public payable {
        count++;
    }
}
