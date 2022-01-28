require("dotenv/config");

const AGGREGATOR_ADDRESS = process.env.AGGREGATOR_ADDRESS;

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery", function () {
  it("Should deploy successfully", async function () {
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(AGGREGATOR_ADDRESS);
    await lottery.deployed();
  });

  it("Should return price number", async function () {
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(AGGREGATOR_ADDRESS);
    await lottery.deployed();

    const price = await lottery.getLatestPrice();

    expect(ethers.BigNumber.isBigNumber(price)).to.be.true;
  });
});
