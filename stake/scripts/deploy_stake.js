const { hre, ethers } = require("hardhat");

const DAPP_TOKEN = "0xCD262963D032089C8697A739D2de82EA139c0b1F";

async function main() {
  const Stake = await ethers.getContractFactory("Stake");
  const stake = await Stake.deploy(DAPP_TOKEN);

  await stake.deployed();

  console.log("Deployed at", stake.address);
}

main();
