const { expect } = require("chai");
const { ethers } = require("hardhat");

const EXAMPLE_URI =
  "https://ipfs.io/ipfs/QmUVgxjzzwDBMBRPvXrSDjgBQptSjMrMey1wD4eGHMJJ3G?filename=metadata.json"; // Adopt me

describe("SimpleNFT", function () {
  it("Should be able to mint", async function () {
    this.timeout(0);
    const signer = await ethers.getSigner(0);
    const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
    const nft = await SimpleNFT.deploy();
    await nft.deployed();

    expect(await nft.balanceOf(nft.signer.address)).to.eq(0);

    const mintTx = await nft.safeMint(signer.address, EXAMPLE_URI);
    await mintTx.wait();

    expect(await nft.balanceOf(nft.signer.address)).to.eq(1);

    expect(await nft.ownerOf(0)).to.eq(signer.address);
    expect(await nft.tokenURI(0)).to.eq(EXAMPLE_URI);
  });
});
