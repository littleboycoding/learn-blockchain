const hre = require("hardhat");

const { getLendingPoolAddressesProvider, getWethGateway } = require("./utils");

const VALUE = hre.ethers.utils.parseEther("0.1");

async function main() {
  const signer = await hre.ethers.getSigner(0);

  const LendingPoolAddressesProvider = await getLendingPoolAddressesProvider();
  const lendingPoolAddr = await LendingPoolAddressesProvider.getLendingPool();

  const WETHGateway = await getWethGateway();

  const depositTx = await WETHGateway.depositETH(
    lendingPoolAddr,
    signer.address,
    0,
    {
      value: VALUE,
    }
  );
  await depositTx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
