const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Receive", function () {
  let receive;
  let signer;

  beforeEach(async () => {
    signer = await ethers.getSigner(0);
    const Receive = await ethers.getContractFactory("Receive");
    receive = await Receive.deploy();
    await receive.deployed();
  });

  it("Should call receive() and emit Deposit event", async function () {
    await expect(await signer.sendTransaction({ to: receive.address, value: ethers.utils.parseEther("1") })).to.emit(receive, "Deposit");
  });

  it("Should be able to withdraw", async function () {
    const transferValue = ethers.utils.parseEther("1");

    await expect(await receive.deposit({ value: transferValue }))
      .to.emit(receive, "Deposit")
      .and.changeEtherBalance(receive, transferValue);

    await expect(await receive.withdraw())
      .to.emit(receive, "Withdraw")
      .and.changeEtherBalance(receive.signer, transferValue);
  });
});
