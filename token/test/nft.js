const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
    const content = "Hello, world";
    let signers;
    let nft;
    let token;

    beforeEach(async () => {
        signers = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy((1 * (10 ** 18)).toString());
        await token.deployed();

        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(content, token.address);
        await nft.deployed();
    })

    it("Should not be able to read without payment", async () => {
        await expect(nft.read()).to.be.reverted;
    })

    it("Should be able to accept payment", async () => {
        const accessTx = await nft.access({ value: ethers.utils.parseEther("1") });
        await accessTx.wait();
    })

    it("Should throw revert if not enough fund", async () => {
        await expect(nft.access({ value: ethers.utils.parseEther("0.9") })).to.be.reverted;
    })

    it("Should be able to access", async () => {
        const accessTx = await nft.access({ value: ethers.utils.parseEther("1") });
        await accessTx.wait();

        const read = await nft.read();
        expect(read).to.eq(content);
    })
});
