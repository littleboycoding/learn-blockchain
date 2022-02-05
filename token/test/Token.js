const { expect } = require("chai");
const { ethers } = require("hardhat");

function numberToString(num) {
  return (num).toString();
}

describe("Token", function () {
  const initialSupply = numberToString(1 * 10 ** 18);
  let token;
  let signers;

  beforeEach(async () => {
    signers = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Learn");
    token = await Token.deploy(initialSupply);
    await token.deployed();
  })

  it("Should deploy with initial supply", async function () {
    expect(await token.balanceOf(token.signer.address)).to.eq(initialSupply);
  })

  it("Should be able to transfer", async function () {
    const trasnferValue = numberToString(1 * 10 ** 17);

    const sender = signers[0];
    const receiver = signers[1];

    await expect(() => token.connect(sender).transfer(receiver.address, trasnferValue)).to.changeTokenBalances(token, [sender, receiver], ["-" + trasnferValue, trasnferValue])
  });
});
