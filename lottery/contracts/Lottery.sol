// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "hardhat/console.sol";

contract Lottery is VRFConsumerBase {
    AggregatorV3Interface internal priceFeed;

    event RequestedRandomness(bytes32 requestId);
    event WinnerAnnounced(address winnerAddress);

    address public minter;
    address payable[] public participate;
    uint256 public usdFee;

    // VRF
    bytes32 internal keyHash;
    uint256 internal linkFee;
    uint256 public randomResult;

    address payable public recentWinner;

    enum STATE {
        START,
        ENDING,
        END
    }
    STATE state = STATE.END;

    constructor(
        address _feedAddr,
        uint256 _usdFee,
        address _vrfCoordinator,
        address _link,
        bytes32 _keyHash,
        uint256 _linkFee
    ) VRFConsumerBase(_vrfCoordinator, _link) {
        minter = msg.sender;
        priceFeed = AggregatorV3Interface(_feedAddr);
        usdFee = _usdFee * (10**18);
        linkFee = _linkFee;
        keyHash = _keyHash;
    }

    modifier IsOwner() {
        require(msg.sender == minter, "Not owner");
        _;
    }

    modifier IsState(STATE _state) {
        require(_state == state, "Not applicable at this state");
        _;
    }

    function enterLottery() public payable IsState(STATE.START) {
        require(msg.value >= getEntranceFee(), "Not enough fee to enter");

        for (uint256 i = 0; i < participate.length; i++) {
            if (participate[i] == msg.sender)
                revert("You already enter this lottery");
        }

        participate.push(payable(msg.sender));
    }

    function startLottery() public IsState(STATE.END) IsOwner {
        state = STATE.START;
    }

    function endLottery() public IsState(STATE.START) IsOwner {
        if (participate.length == 0) {
            state = STATE.END;
        } else {
            state = STATE.ENDING;
            bytes32 requestId = requestRandomness(keyHash, linkFee);
            emit RequestedRandomness(requestId);
        }
    }

    function getEntranceFee() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 adjustedFee = uint256(price) * (10**10);
        uint256 fee = (usdFee * 10**18) / adjustedFee;

        return fee;
    }

    function fulfillRandomness(bytes32, uint256 _randomness) internal override {
        randomResult = _randomness;

        uint256 winnerIndex = randomResult % participate.length;
        recentWinner = participate[winnerIndex];

        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        require(success, "Transfer failed");

        participate = new address payable[](0);
        state = STATE.END;

        emit WinnerAnnounced(recentWinner);
    }

    function getRecentWinner() public view returns (address winner) {
        return recentWinner;
    }

    function getParticipators() public view returns (address payable[] memory) {
        return participate;
    }
}
