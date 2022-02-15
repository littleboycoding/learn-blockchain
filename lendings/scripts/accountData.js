const hre = require("hardhat");

const { getLendingPool, getLendingPoolAddressesProvider } = require("./utils");

async function main() {
  const signer = await hre.ethers.getSigner(0);

  const LendingPoolAddressesProvider = await getLendingPoolAddressesProvider();
  const lendingPoolAddr = await LendingPoolAddressesProvider.getLendingPool();

  const LendingPool = await getLendingPool(lendingPoolAddr);

  const accountData = await LendingPool.getUserAccountData(signer.address);

  console.log(accountData);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
