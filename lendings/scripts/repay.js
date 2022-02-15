const hre = require("hardhat");

const {
  getLendingPoolAddressesProvider,
  getLendingPool,
  getPriceOracle,
  getERC20,
} = require("./utils");

const DAI_ADDRESS = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";

// uint(-1);
const ENTIRE =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

async function main() {
  const signer = await hre.ethers.getSigner(0);

  const LendingPoolAddressesProvider = await getLendingPoolAddressesProvider();
  const lendingPoolAddr = await LendingPoolAddressesProvider.getLendingPool();

  const LendingPool = await getLendingPool(lendingPoolAddr);

  const ERC20 = await getERC20(DAI_ADDRESS);

  const approveTx = await ERC20.approve(lendingPoolAddr, ENTIRE);
  await approveTx.wait();

  const repayTx = await LendingPool.repay(
    DAI_ADDRESS,
    ENTIRE,
    1,
    signer.address
  );
  await repayTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
