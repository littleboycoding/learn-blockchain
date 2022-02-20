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

describe("Randomable NFT", function () {
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

    // const VRFCoordinatorV2Mock = await ethers.getContractFactory(
    //   "VRFCoordinatorV2Mock"
    // );
    // const vrf = await VRFCoordinatorV2Mock.deploy();
    // await vrf.deployed();

    const RandomableNFT = await ethers.getContractFactory("RandomableNFT");
    nft = await RandomableNFT.deploy(
      process.env.KEY_HASH,
      1,
      100000,
      process.env.MINIMUM_CONFIRMATIONS,
      process.env.SUBSCRIPTION_ID,
      process.env.VRF_COORDINATOR
    );
    await nft.deployed();
  });

  it("Should be able to get random token", async () => {
    console.log(
      "Disabled due to incompatible openzeppelin and chainlink contract (VRFv2 is still new)"
    );
    return;
    // if (network.name !== "rinkeby") return; // Only testable on Rinkeby

    const metadataKeys = Object.keys(metadatas);

    for (let i = 0; i < metadataKeys.length; i++) {
      console.log("Adding token...", metadataKeys[i]);
      await nft.addToken(metadataKeys[i]).then((tx) => tx.wait());
    }

    // const VRF = await ethers.getContractAt(
    //   "VRFCoordinatorV2Interface",
    //   process.env.VRF_COORDINATOR
    // );

    // console.log("Adding consumer...");
    // await VRF.connect(signers[0])
    //   .addConsumer(process.env.SUBSCRIPTION_ID, nft.address)
    //   .then((tx) => tx.wait());

    // console.log("Approving...");
    // await nft
    //   .setApprovalForAll(process.env.VRF_COORDINATOR, true)
    //   .then((tx) => tx.wait());

    // console.log("Requesting Random Token...");
    // await nft
    //   .connect(signers[1])
    //   .getRandomToken()
    //   .then((tx) => tx.wait());

    // console.log("Waiting for ChainLink VRF to respond...");
    // await wait(120000); // Wait for VRF to respond, 2 min

    // expect(await nft.balanceOf(signers[0].address)).to.eq(
    //   metadataKeys.length - 1
    // );
    // expect(await nft.balanceOf(signers[1].address)).to.eq(1);
  });
});
