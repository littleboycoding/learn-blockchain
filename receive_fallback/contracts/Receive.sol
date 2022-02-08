// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Receive {
    event Deposit(uint256 value);
    event Withdraw(uint256 value);

    receive() external payable {
        deposit();
    }

    function deposit() public payable {
        emit Deposit(msg.value);
    }

    function withdraw() public {
        uint256 b = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: b}("");

        require(success, "Transfer not success");

        emit Withdraw(b);
    }
}
