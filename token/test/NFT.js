const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
    const CONTENT = "Hello, world";

    let nft;

    beforeEach(async () => {
        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy(CONTENT, (1 * (10 ** 18)).toString());
        await nft.deployed();
    })

    it("Should be able to read as minter", async () => {
        const content = await nft.read();
        expect(content).to.eq(CONTENT);
    })
});
