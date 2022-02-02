require("dotenv/config");

const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("env", "Get environment variables", () => {
  console.table({
    INFURA_RINKEBY_URL: process.env.INFURA_RINKEBY_URL,
    INFURA_MAINNET_URL: process.env.INFURA_MAINNET_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
  });
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.INFURA_RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.6.6",
      },
    ],
  },
};
