const { hre, ethers } = require("hardhat");

async function main() {
  const DappToken = await ethers.getContractFactory("DappToken");
  const dappToken = await DappToken.deploy();

  await dappToken.deployed();

  console.log("Deployed at", dappToken.address);
}

main();
