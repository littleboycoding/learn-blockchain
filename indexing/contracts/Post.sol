//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Post {
    constructor() {
        console.log("Deploying a Post");
    }

    event CreatePost(string _title);

    function createPost(string memory _title) public {
	    emit CreatePost(_title);
    }
}
