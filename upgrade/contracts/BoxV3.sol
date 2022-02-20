//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract BoxV3 is Initializable {
    uint256 public counter;

    function initialize() public initializer {}

    function increment() public {
        counter = counter + 1;
    }

    function decrease() public {
        counter = counter - 1;
    }

    function retrieve() public view returns (uint256) {
        return counter;
    }
}
