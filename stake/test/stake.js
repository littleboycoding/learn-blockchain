const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

const AGGREGATOR_ABI = require("@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json");

describe("Stake", function () {
  let stake;
  let dappToken;
  let signers;

  before(async () => {
    signers = await ethers.getSigners();
  });

  beforeEach(async () => {
    const Stake = await ethers.getContractFactory("Stake");
    const DappToken = await ethers.getContractFactory("DappToken");

    dappToken = await DappToken.deploy();
    await dappToken.deployed();
    stake = await Stake.deploy(dappToken.address);
    await stake.deployed();

    await dappToken
      .transfer(stake.address, ethers.utils.parseEther("1"))
      .then((tx) => tx.wait());
  });

  describe("isTokenAllowed", function () {
    it("Should be verify if token is allowed or not", async () => {
      const ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      expect(await stake.isTokenAllowed(ADDRESS)).to.eq(false);
      await stake.addAllowToken(ADDRESS).then((tx) => tx.wait());
      expect(await stake.isTokenAllowed(ADDRESS)).to.eq(true);
    });
  });

  describe("addAllowedToken", function () {
    it("Should be able to add token", async () => {
      const ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      expect(await stake.isTokenAllowed(ADDRESS)).to.eq(false);
      await stake.addAllowToken(ADDRESS).then((tx) => tx.wait());
      expect(await stake.isTokenAllowed(ADDRESS)).to.eq(true);
    });
  });
  describe("addPriceFeeds", function () {
    it("Should be able to add price feed for token", async () => {
      const TOKEN_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      const PRICE_FEED_ADDRESS = "0x773616E4d11A78F511299002da57A0a94577F1f4";
      expect(await stake.priceFeeds(TOKEN_ADDRESS)).to.not.eq(
        PRICE_FEED_ADDRESS
      );
      await stake
        .addPriceFeed(TOKEN_ADDRESS, PRICE_FEED_ADDRESS)
        .then((tx) => tx.wait());
      expect(await stake.priceFeeds(TOKEN_ADDRESS)).to.eq(PRICE_FEED_ADDRESS);
    });
  });
  describe("stake", function () {
    it("Should be able to stake", async () => {
      const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
      const mockToken = await ERC20Mock.deploy("MockToken", "MK");
      await mockToken.deployed();

      await stake.addAllowToken(mockToken.address).then((tx) => tx.wait());

      await mockToken
        .approve(stake.address, ethers.utils.parseEther("0.1"))
        .then((tx) => tx.wait());
      await stake
        .stake(mockToken.address, ethers.utils.parseEther("0.1"))
        .then((tx) => tx.wait());

      expect(await stake.stakers(0)).to.eq(signers[0].address);
      expect(await stake.totalStakedTokens(signers[0].address)).to.eq(1);
    });
  });

  describe("unstake", function () {
    it("Should be able to unstake", async () => {
      const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
      const mockToken = await ERC20Mock.deploy("MockToken", "MK");
      await mockToken.deployed();

      await stake.addAllowToken(mockToken.address).then((tx) => tx.wait());

      await mockToken
        .approve(stake.address, ethers.utils.parseEther("0.1"))
        .then((tx) => tx.wait());
      await stake
        .stake(mockToken.address, ethers.utils.parseEther("0.1"))
        .then((tx) => tx.wait());

      expect(await stake.stakers(0)).to.eq(signers[0].address);

      await stake
        .unstake(mockToken.address, ethers.utils.parseEther("0.1"))
        .then((tx) => tx.wait());

      // Staker at index 0 not exist anymore (unstaked)
      await expect(stake.stakers(0)).to.reverted;
    });
  });

  describe("issue", function () {
    it("Should be able to issue rewards to all stakers", async () => {
      const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
      const mockToken = await ERC20Mock.deploy("MockToken", "MK");
      await mockToken.deployed();

      const STAKING_VALUE = ethers.utils.parseEther("0.1");
      const PRICE = 1_50000000;
      const DECIMAL = 8;

      aggregator = await waffle.deployMockContract(signers[0], AGGREGATOR_ABI);
      await aggregator.mock.latestRoundData.returns(0, PRICE, 0, 0, 0);
      await aggregator.mock.decimals.returns(DECIMAL);

      await stake.addAllowToken(mockToken.address).then((tx) => tx.wait());
      await stake
        .addPriceFeed(mockToken.address, aggregator.address)
        .then((tx) => tx.wait());

      await mockToken
        .approve(stake.address, STAKING_VALUE)
        .then((tx) => tx.wait());
      await stake
        .stake(mockToken.address, STAKING_VALUE)
        .then((tx) => tx.wait());

      // Staked * Price / Decimal = Total rewards;
      const rewards = STAKING_VALUE.mul(PRICE).div(10 ** DECIMAL);

      await expect(() =>
        stake.issue().then((tx) => tx.wait())
      ).to.changeTokenBalance(dappToken, signers[0], rewards);
    });
  });
});
