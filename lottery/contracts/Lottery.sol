//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Lottery {
    address payable owner;
    address payable[] participate;
    bool state;
    
    constructor() {
        console.log("Deploying a Lottery");
        owner = payable(msg.sender);
    }

    function join() public {
        console.log("Participater", msg.sender);
        participate.push(payable(msg.sender));
    }

    function end() public view {
        console.log("Lottery ended, selecting winner");
    }
}
