const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fallback", function () {
  let fallback;
  let signer;

  beforeEach(async () => {
    signer = await ethers.getSigner(0);
    const Fallback = await ethers.getContractFactory("Fallback");
    fallback = await Fallback.deploy();
    await fallback.deployed();
  });

  it("Should return initial count (0)", async function () {
    const count = await fallback.getCount();
    expect(count).to.eq(0)
  });

  it("Should be able to increment counter", async function () {
    expect(await fallback.getCount()).to.eq(0);

    const addTx = await fallback.add();
    await addTx.wait();

    expect(await fallback.getCount()).to.eq(1);

    const transactionTx = await signer.sendTransaction({ to: fallback.address });
    await transactionTx.wait();

    expect(await fallback.getCount()).to.eq(2);
  });
});
