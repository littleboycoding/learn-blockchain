// Deployed at 0x946C0080a972B583B8fD960044cc77200653FB1c
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundMe {
	address payable minter;

	constructor() payable {
		minter = payable(msg.sender);
	}

	modifier owner() {
		require(msg.sender == minter, "only owner");
		_;
	}

	function retrive() public view returns (uint) {
		return address(this).balance;
	}

	function fund() public payable {}

	function withdraw() public owner {
		uint amount = retrive();
		(bool success, ) = minter.call{value: amount}("");
		require(success, "failed to send ether");
	}
}

