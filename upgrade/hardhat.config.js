const { task } = require("hardhat/config");

require("dotenv/config");
require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy", "Deploy proxy")
  .addPositionalParam("contract", "contract name")
  .setAction(async (taskArgs, hre) => {
    const Contract = await hre.ethers.getContractFactory(taskArgs.contract);
    const contract = await upgrades.deployProxy(Contract);
    await contract.deployed();
    console.log("Deployed");
  });

task("upgrade", "Upgrade contract")
  .addPositionalParam("contract", "new contract name")
  .addPositionalParam("address", "proxy address to upgrade to")
  .setAction(async (taskArgs, hre) => {
    const Contract = await hre.ethers.getContractFactory(taskArgs.contract);
    await upgrades.upgradeProxy(taskArgs.address, Contract);
    console.log("Upgraded");
  });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.INFURA_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
