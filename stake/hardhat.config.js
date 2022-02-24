require("dotenv/config");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.4.18",
      },
    ],
  },
  networks: {
    rinkeby: {
      url: process.env.INFURA_ENDPOINT,
      accounts: [process.env.ACCOUNTS],
    },
  },
  etherscan: {
    apiKey: "A4MVUG411UDBCWHF9MX9KXMV48HPCISQDT",
  },
};
