// Rinkeby integration testing.

require("dotenv/config");
const linkTokenInterface = require("@chainlink/contracts/abi/v0.8/LinkTokenInterface.json");

const USD_FEE = 1;

// VRF
const VRF_ADDRESS = process.env.RINKEBY_VRF_ADDRESS;
const AGGREGATOR = process.env.RINKEBY_AGGREGATOR_ADDRESS;
const KEY_HASH = process.env.RINKEBY_VRF_COORDINATOR_KEY_HASH;
const LINK_TOKEN = process.env.RINKEBY_LINK_TOKEN;

const { expect } = require("chai");
const { ethers } = require("hardhat");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Lottery", function () {
  this.timeout(0);

  let lottery;
  let signers;

  beforeEach(async function () {
    signers = await ethers.getSigners();
    const linkFee = 1 * 10 ** 17;

    const Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy(
      AGGREGATOR,
      USD_FEE,
      VRF_ADDRESS,
      LINK_TOKEN,
      KEY_HASH,
      linkFee.toString() // 0.1 Link
    );

    await lottery.deployed();

    console.log("Lottery deployed");

    const link = new ethers.Contract(
      LINK_TOKEN,
      linkTokenInterface,
      signers[0]
    );

    // Fund 1 Link to Lottery contract
    const transferTx = await link.transfer(lottery.address, linkFee.toString());
    await transferTx.wait();

    console.log("Funded contract with Link");
  });

  it("Should be able to pick winner correctly", async function () {
    const price = await lottery.getEntranceFee();
    const prizePool = price;
    console.log("Fetched fee", price);

    const startTx = await lottery.startLottery();
    await startTx.wait();
    console.log("Started lottery");

    const enterTx = await lottery.enterLottery({ value: price });
    await enterTx.wait();
    console.log("Entered lottery");

    const startBalanceOfWinner = await signers[0].getBalance(); // Minus gas fee
    await expect(await ethers.provider.getBalance(lottery.address)).to.eq(
      prizePool.toString()
    );
    // await expect(lottery.endLottery()).to.emit(lottery, "RequestedRandomness");
    const endTx = await lottery.endLottery();
    await endTx.wait();
    console.log("Ended lottery, choosing winner");

    await sleep(60000 * 3); // Rinkey take roughly 3 min to send & receive VRF

    const balance = await signers[0].getBalance();
    console.log(balance, startBalanceOfWinner, prizePool);
    await expect(await lottery.getRecentWinner()).to.eq(signers[0].address);
    await expect(await ethers.provider.getBalance(lottery.address)).to.eq(0);
    await expect(balance).to.eq(startBalanceOfWinner.add(prizePool.toString()));
  });
});
