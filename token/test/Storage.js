const { expect } = require("chai");
const hardhat = require("hardhat");

describe("Storage", function () {
    const CONTENT = "Hello, world";
    let storage;
    let token;
    let signers;

    beforeEach(async () => {
        signers = await hardhat.ethers.getSigners();

        const initialSupply = (1 * (10 ** 18)).toString();

        const Token = await ethers.getContractFactory("Learn");
        token = await Token.deploy(initialSupply.toString());
        await token.deployed();

        const Storage = await ethers.getContractFactory("Storage");
        storage = await Storage.deploy(token.address);
        await storage.deployed();
    })

    it("Should be able to mint new NFT", async () => {
        expect(storage.mint(CONTENT)).to.emit(storage, "MintNFT");
    })

    it("Should be able to grant access", async () => {
        const approvement = (1 * (10 ** 18)).toString();

        const approveTx = await token.approve(storage.address, approvement);
        await approveTx.wait()

        await storage.mint(CONTENT);

        await new Promise((resolve) => {
            storage.on("MintNFT", async (address) => {
                const accessTx = await storage.access(address);
                await accessTx.wait();

                const NFT = await hardhat.ethers.getContractFactory("NFT");
                const nft = await new hardhat.ethers.Contract(address, NFT.interface, signers[0]);

                const content = await nft.read();
                expect(content).to.eq(CONTENT);

                resolve();
            })
        })
    })
});
