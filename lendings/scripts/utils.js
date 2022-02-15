require("dotenv/config");
const hre = require("hardhat");

function getLendingPoolAddressesProvider() {
  return hre.ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    process.env.LENDING_POOL_ADDRESSES_PROVIDER
  );
}

function getLendingPool(address) {
  return hre.ethers.getContractAt("ILendingPool", address);
}

function getWethGateway() {
  return hre.ethers.getContractAt("IWETHGateway", process.env.WETH_GATEWAY);
}

function getWeth() {
  return hre.ethers.getContractAt("IWETH", process.env.WETH_ADDRESS);
}

function getPriceOracle(address) {
  return hre.ethers.getContractAt("IPriceOracle", address);
}

function getERC20(address) {
  return hre.ethers.getContractAt("IERC20", address);
}

module.exports = {
  getLendingPool,
  getLendingPoolAddressesProvider,
  getWeth,
  getWethGateway,
  getPriceOracle,
  getERC20,
};
