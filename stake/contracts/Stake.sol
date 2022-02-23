// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// ChainLink
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Debugging
import "hardhat/console.sol";

import "./DappToken.sol";

contract Stake is Ownable {
    DappToken public dappToken;
    address[] public allowedTokens;
    mapping(address => address) public priceFeeds;
    mapping(address => mapping(address => uint256)) public stakingBalances;
    address[] public stakers;
    mapping(address => uint256) public totalStakedTokens;

    constructor(address _dappToken) {
        dappToken = DappToken(_dappToken);
    }

    function addAllowToken(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function addPriceFeed(address _token, address _priceFeed) public onlyOwner {
        priceFeeds[_token] = _priceFeed;
    }

    function isTokenAllowed(address _token) public view returns (bool) {
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            if (allowedTokens[i] == _token) return true;
        }
        return false;
    }

    function updateTotalStakedTokens(address _user) internal {
        uint256 total = 0;
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            address token = allowedTokens[i];
            if (stakingBalances[token][_user] > 0) total += 1;
        }
        totalStakedTokens[_user] = total;
    }

    function stake(address _token, uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than 0");
        require(isTokenAllowed(_token), "Token is not allowed");

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        stakingBalances[_token][msg.sender] += _amount;

        if (totalStakedTokens[msg.sender] == 0) {
            stakers.push(msg.sender);
        }

        updateTotalStakedTokens(msg.sender);
    }

    function unstake(address _token, uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than 0");
        require(isTokenAllowed(_token), "Token is not allowed");
        require(
            _amount <= stakingBalances[_token][msg.sender],
            "Amount must be less than staked token"
        );

        IERC20(_token).transfer(msg.sender, _amount);
        stakingBalances[_token][msg.sender] -= _amount;
        updateTotalStakedTokens(msg.sender);

        if (totalStakedTokens[msg.sender] == 0) {
            for (uint256 i = 0; i < stakers.length; i++) {
                if (stakers[i] == msg.sender) {
                    stakers[i] = stakers[stakers.length - 1];
                    stakers.pop();
                    break;
                }
            }
        }
    }

    function issue() public onlyOwner {
        for (uint256 i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            uint256 stakerTotalValue = getUserTokenValue(staker);
            dappToken.transfer(staker, stakerTotalValue);
        }
    }

    function getUserTokenValue(address _user) public view returns (uint256) {
        uint256 total = 0;

        for (uint256 i = 0; i < allowedTokens.length; i++) {
            total += getUserSingleTokenValue(allowedTokens[i], _user);
        }

        return total;
    }

    function getUserSingleTokenValue(address _token, address _user)
        public
        view
        returns (uint256)
    {
        if (stakingBalances[_token][_user] == 0) return 0;
        (uint256 tokenPrice, uint256 decimal) = getTokenPrice(_token);

        return (stakingBalances[_token][_user] * tokenPrice) / 10**decimal;
    }

    function getTokenPrice(address _token)
        public
        view
        returns (uint256, uint256)
    {
        AggregatorV3Interface aggregator = AggregatorV3Interface(
            priceFeeds[_token]
        );

        (, int256 price, , , ) = aggregator.latestRoundData();
        uint256 decimal = aggregator.decimals();

        return (uint256(price), decimal);
    }
}
