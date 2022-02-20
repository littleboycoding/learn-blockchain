const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Box", function () {
  it("Should be able to upgrade", async function () {
    const Box = await ethers.getContractFactory("Box");
    const box = await upgrades.deployProxy(Box);
    await box.deployed();

    const BoxV2 = await ethers.getContractFactory("BoxV2");
    const boxv2 = await upgrades.upgradeProxy(box.address, BoxV2);

    expect(box.address).to.eq(boxv2.address);
  });

  it("Should be able to call newly upgraded function", async function () {
    const Box = await ethers.getContractFactory("Box");
    const box = await upgrades.deployProxy(Box);
    await box.deployed();

    await expect(() => box.increment()).to.throw();

    const BoxV2 = await ethers.getContractFactory("BoxV2");
    const boxv2 = await upgrades.upgradeProxy(box.address, BoxV2);

    expect(box.address).to.eq(boxv2.address);

    await expect(() => boxv2.increment()).to.not.throw();

    await sleep(1000);

    expect(await box.retrieve()).to.eq(await boxv2.retrieve());
  });
});
