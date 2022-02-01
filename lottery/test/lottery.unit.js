require("dotenv/config");

// ABI for mokcing
const AGGREGATOR_ABI = require("@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json");

const USD_FEE = 50;
const RNG = 777; // Lucky number btw

// VRF
const KEY_HASH =
  "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";

const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Lottery", function () {
  let lottery;
  let aggregator;
  let vrf;
  let link;
  let signers;

  beforeEach(async function () {
    signers = await ethers.getSigners();

    aggregator = await waffle.deployMockContract(signers[0], AGGREGATOR_ABI);
    await aggregator.mock.latestRoundData.returns(0, 2000_00000000, 0, 0, 0);

    const Link = await ethers.getContractFactory("LinkToken");
    link = await Link.deploy();

    const VRF = await ethers.getContractFactory("VRFCoordinatorMock");
    vrf = await VRF.deploy(link.address);

    const Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy(
      aggregator.address,
      USD_FEE,
      vrf.address,
      link.address,
      KEY_HASH,
      (1 * 10 ** 17).toString() // 0.1 Link
    );

    // Fund 1 Link to Lottery contract
    await link.transfer(lottery.address, (1 * 10 ** 18).toString());

    lottery.on("RequestedRandomness", (requestId) => {
      vrf.callBackWithRandomness(requestId, RNG, lottery.address);
    });
  });

  it("Should be able to pick winner correctly", async function () {
    const price = await lottery.getEntranceFee();
    const prizePool = price * 2;

    await lottery.startLottery();
    await lottery.connect(signers[0]).enterLottery({ value: price });
    await lottery.connect(signers[1]).enterLottery({ value: price }); // This is winner  (777 % 2 = 1)
    const startBalanceOfWinner = await ethers.provider.getBalance(
      signers[1].address
    ); // Minus gas fee
    await expect(await ethers.provider.getBalance(lottery.address)).to.eq(
      prizePool.toString()
    );
    await expect(lottery.endLottery()).to.emit(lottery, "RequestedRandomness");

    await sleep(5000);

    await expect(await lottery.getRecentWinner()).to.eq(signers[1].address);
    await expect(await ethers.provider.getBalance(lottery.address)).to.eq(0);
    const balance = await ethers.provider.getBalance(signers[1].address);
    await expect(balance).to.eq(startBalanceOfWinner.add(prizePool.toString()));
  });

  it("Should return entrace fee correctly", async function () {
    const price = await lottery.getEntranceFee();

    expect(ethers.BigNumber.isBigNumber(price)).to.be.true;
  });

  it("Should be able to start lottery", async function () {
    await lottery.startLottery();
  });

  it("Should be able to end lottery", async function () {
    await lottery.startLottery();
    await expect(await lottery.endLottery()).to.changeEtherBalance(lottery, 0);
  });

  it("Should be able to enter lottery", async function () {
    await lottery.startLottery();
    const fee = await lottery.getEntranceFee();

    await expect(
      await lottery.enterLottery({ value: fee })
    ).to.changeEtherBalance(lottery, fee);

    const participators = await lottery.getParticipators();

    expect(participators).to.be.a("array");
    expect(participators.length).to.eq(1);
    expect(participators[0]).to.eq(await lottery.signer.getAddress());
    expect();
  });

  it("Should revert because already enter", async function () {
    await lottery.startLottery();
    const fee = await lottery.getEntranceFee();

    await lottery.enterLottery({ value: fee });
    expect(lottery.enterLottery({ value: fee })).to.be.reverted;
  });

  it("Should not be able to end lottery if it not started", async function () {
    expect(lottery.endLottery()).to.be.reverted;
  });

  it("Should not be able to start lottery if it already started", async function () {
    await lottery.startLottery();
    expect(lottery.startLottery()).to.be.reverted;
  });

  it("Should not be able to start lottery if not owner", async function () {
    const signers = await ethers.getSigners();

    expect(lottery.connect(signers[1]).startLottery()).to.be.reverted;
  });

  it("Should not be able to end lottery if not owner", async function () {
    const signers = await ethers.getSigners();

    await lottery.startLottery();
    expect(lottery.connect(signers[1]).endLottery()).to.be.reverted;
  });
});
