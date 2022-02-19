require("dotenv/config");

const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const fs = require("fs/promises");
const path = require("path");

let BASE_GATEWAY = "https://ipfs.io/ipfs/";

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe("AdvanceNFT", function () {
  this.timeout(0);

  let nft;
  let signers;
  let metadatas = {};

  this.beforeAll(async () => {
    const metadataPath = path.resolve("metadatas");
    const metadataList = await fs.readdir(metadataPath);

    const contents = await Promise.all(
      metadataList.map((m) =>
        fs.readFile(path.join(metadataPath, m), { encoding: "utf-8" })
      )
    );

    for (let k in metadataList) {
      const parsed = path.parse(metadataList[k]);
      metadatas[parsed.name] = contents[k];
    }

    if (Object.keys(metadatas).length < 3)
      throw new Error(
        "Required to have at least 3 metadatas, see npx hardhat help ipfs for helper"
      );
  });

  this.beforeEach(async () => {
    signers = await ethers.getSigners();

    const AdvanceNFT = await ethers.getContractFactory("AdvanceNFT");
    nft = await AdvanceNFT.deploy(
      process.env.KEY_HASH,
      1,
      100000,
      process.env.MINIMUM_CONFIRMATIONS,
      process.env.SUBSCRIPTION_ID,
      process.env.VRF_COORDINATOR
    );
    await nft.deployed();
  });

  it("Should be able to mint", async function () {
    expect(await nft.totalSupply()).to.eq(0);

    const metadataKeys = Object.keys(metadatas);

    for (let i = 0; i < metadataKeys.length; i++) {
      await nft.safeMint(metadataKeys[i]).then((tx) => tx.wait());
    }

    expect(await nft.totalSupply()).to.eq(metadataKeys.length);

    // Verify some token
    let tokenId = await nft.tokenByIndex(0);
    expect(await nft.tokenURI(tokenId)).to.eq(BASE_GATEWAY + metadataKeys[0]);
  });

  it("Should be able to transfer", async function () {
    expect(await nft.totalSupply()).to.eq(0);

    const metadataKeys = Object.keys(metadatas);

    for (let i = 0; i < metadataKeys.length; i++) {
      await nft.safeMint(metadataKeys[i]).then((tx) => tx.wait());
    }

    await nft["safeTransferFrom(address,address,uint256)"](
      signers[0].address,
      signers[1].address,
      0
    ).then((tx) => tx.wait());

    expect(await nft.balanceOf(signers[0].address)).to.eq(
      metadataKeys.length - 1
    );
    expect(await nft.balanceOf(signers[1].address)).to.eq(1);
  });

  it("Should not be able to transfer when not an owner or approved", async function () {
    expect(await nft.totalSupply()).to.eq(0);

    const metadataKeys = Object.keys(metadatas);

    for (let i = 0; i < metadataKeys.length; i++) {
      await nft.safeMint(metadataKeys[i]).then((tx) => tx.wait());
    }

    await expect(
      nft
        .connect(signers[1])
        ["safeTransferFrom(address,address,uint256)"](
          signers[0].address,
          signers[1].address,
          0
        )
    ).to.be.reverted;
  });

  it("Should be able to transfer when not an owner but approved", async function () {
    expect(await nft.totalSupply()).to.eq(0);

    const metadataKeys = Object.keys(metadatas);

    for (let i = 0; i < metadataKeys.length; i++) {
      await nft.safeMint(metadataKeys[i]).then((tx) => tx.wait());
    }
    await nft.approve(signers[1].address, 0).then((tx) => tx.wait());

    await nft
      .connect(signers[1])
      ["safeTransferFrom(address,address,uint256)"](
        signers[0].address,
        signers[1].address,
        0
      )
      .then((tx) => tx.wait());

    await nft
      .setApprovalForAll(signers[1].address, true)
      .then((tx) => tx.wait());

    await nft
      .connect(signers[1])
      ["safeTransferFrom(address,address,uint256)"](
        signers[0].address,
        signers[1].address,
        1
      )
      .then((tx) => tx.wait());

    await nft
      .connect(signers[1])
      ["safeTransferFrom(address,address,uint256)"](
        signers[0].address,
        signers[1].address,
        2
      )
      .then((tx) => tx.wait());
  });

  it("Should be able to get random token", async () => {
    if (network.name !== "rinkeby") return; // Only testable on Rinkeby

    const metadataKeys = Object.keys(metadatas);

    for (let i = 0; i < metadataKeys.length; i++) {
      console.log("Minting...", metadataKeys[i]);
      await nft.safeMint(metadataKeys[i]).then((tx) => tx.wait());
    }

    const VRF = await ethers.getContractAt(
      "VRFCoordinatorV2Interface",
      process.env.VRF_COORDINATOR
    );

    console.log("Adding consumer...");
    await VRF.connect(signers[0])
      .addConsumer(process.env.SUBSCRIPTION_ID, nft.address)
      .then((tx) => tx.wait());

    console.log("Approving...");
    await nft
      .setApprovalForAll(process.env.VRF_COORDINATOR, true)
      .then((tx) => tx.wait());

    console.log("Requesting Random Token...");
    await nft
      .connect(signers[1])
      .getRandomToken()
      .then((tx) => tx.wait());

    console.log("Waiting for ChainLink VRF to respond...");
    await wait(120000); // Wait for VRF to respond, 2 min

    expect(await nft.balanceOf(signers[0].address)).to.eq(
      metadataKeys.length - 1
    );
    expect(await nft.balanceOf(signers[1].address)).to.eq(1);
  });
});
