const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("NFT", function () {
    const CONTENT = "Hello, world";

    let signers;
    let nft;
    let token;

    beforeEach(async () => {
        signers = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy((1 * (10 ** 18)).toString());
        await token.deployed();

        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(CONTENT, (1 * (10 ** 18)).toString(), token.address);
        await nft.deployed();
    })

    it("Should not be able to read without payment", async () => {
        await expect(nft.read()).to.be.reverted;
    })

    it("Should be able to accept payment", async () => {
        const approveCost = BigNumber.from(1).mul(BigNumber.from(10).pow(18)); // 1 with 18 decimal

        const approveTx = await token.approve(nft.address, approveCost);
        await approveTx.wait();

        const accessTx = await nft.access();
        await accessTx.wait();
    })


    it("Should be able to access content after payment", async () => {
        const approveCost = BigNumber.from(1).mul(BigNumber.from(10).pow(18)); // 1 with 18 decimal

        const approveTx = await token.approve(nft.address, approveCost);
        await approveTx.wait();

        const accessTx = await nft.access();
        await accessTx.wait();

        const content = await nft.read();
        expect(content).to.eq(CONTENT);
    })
});
