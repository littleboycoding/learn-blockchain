// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFT.sol";
import "hardhat/console.sol";

interface ERC20 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success);
}

interface Token {
    function grant(address _grantTo) external;
}

contract Storage {
    address erc20;

    event MintNFT(address _address);

    constructor(address _erc20) {
        erc20 = _erc20;
    }

    function mint(string memory _content) public {
        NFT newNFT = new NFT(_content, 1 * (10**18));

        emit MintNFT(address(newNFT));
    }

    function access(address _token) public {
        bool success = ERC20(erc20).transferFrom(
            msg.sender,
            _token,
            1 * (10**18)
        );

        require(success, "Transfer failed");

        Token(_token).grant(msg.sender);
    }
}
