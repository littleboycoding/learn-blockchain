const hre = require("hardhat");

const {
  getLendingPoolAddressesProvider,
  getLendingPool,
  getPriceOracle,
} = require("./utils");

const DAI_ADDRESS = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";

async function main() {
  const signer = await hre.ethers.getSigner(0);

  const LendingPoolAddressesProvider = await getLendingPoolAddressesProvider();

  const lendingPoolAddr = await LendingPoolAddressesProvider.getLendingPool();
  const priceOracleAddr = await LendingPoolAddressesProvider.getPriceOracle();

  const PriceOracle = await getPriceOracle(priceOracleAddr);
  const daiPrice = await PriceOracle.getAssetPrice(DAI_ADDRESS);

  const LendingPool = await getLendingPool(lendingPoolAddr);
  const [, , availableBorrow] = await LendingPool.getUserAccountData(
    signer.address
  );

  const borrowableDAI = (1 / daiPrice) * (availableBorrow * 0.95); // 0.95 is safety helmet

  console.log(
    "1 DAI EQUAL TO " + daiPrice + " ETH (WEI)",
    "\nAvailable to borrow " + availableBorrow + " ETH (WEI)",
    "\nBorrowable DAI " +
      (1 / daiPrice) * availableBorrow +
      ` (${hre.ethers.utils.parseUnits(
        ((1 / daiPrice) * availableBorrow).toString(),
        18
      )})`
  );

  const borrowTx = await LendingPool.borrow(
    DAI_ADDRESS,
    hre.ethers.utils.parseUnits(borrowableDAI.toString(), 18),
    1,
    0,
    signer.address
  );
  await borrowTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
