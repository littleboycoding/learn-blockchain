// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Lottery {
    AggregatorV3Interface internal priceFeed;
    address payable[] participate;
    enum STATE {
        START,
        ENDING,
        END
    }
    STATE state = STATE.START;

    constructor(address _feedAddr) {
        priceFeed = AggregatorV3Interface(_feedAddr);
    }

    function enter() public payable {
        require(state == STATE.START, "Lottery doesn't start yet");
        participate.push(payable(msg.sender));
    }

    function start() public {
        require(state == STATE.END, "Lottery already started");
        state = STATE.START;
    }

    function end() public {
        require(state == STATE.START, "Lottery already ended");
        state = STATE.END;
    }

    function getLatestPrice() public view returns (int256) {
        // price does come with 8 decimal
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }
}
