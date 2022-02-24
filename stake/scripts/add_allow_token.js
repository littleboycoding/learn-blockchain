const { hre, ethers } = require("hardhat");

const tokens = require("../tokens.json");

const STAKE_ADDRESS = "0x191bfd8577938C980cb59028c6C8f20702709D0B";

async function main() {
  const Stake = await ethers.getContractAt("Stake", STAKE_ADDRESS);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    console.log("Setting allow token for", token.name);

    await Stake.addAllowToken(token.address).then((tx) => tx.wait());
    await Stake.addPriceFeed(token.address, token.priceFeed).then((tx) =>
      tx.wait()
    );
  }

  console.log("Successfully");
}

main();
