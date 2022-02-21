// Demonstrate upgrading without plugin, not convenient

const { ethers } = require("hardhat");

async function main() {
  const Box = await ethers.getContractFactory("Box");
  const BoxV2 = await ethers.getContractFactory("BoxV2");

  // Deploy logic
  const box = await Box.deploy();
  await box.deployed();
  const boxv2 = await BoxV2.deploy();
  await boxv2.deployed();

  // Deploy proxy admin
  const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
  const proxyAdmin = await ProxyAdmin.deploy();
  await proxyAdmin.deployed();

  // Deploy transparent proxy
  const TransparentUpgradeableProxy = await ethers.getContractFactory(
    "TransparentUpgradeableProxy"
  );

  const transparentUpgradeableProxy = await TransparentUpgradeableProxy.deploy(
    box.address,
    proxyAdmin.address,
    []
  );
  await transparentUpgradeableProxy.deployed();

  // Upgrading
  await proxyAdmin
    .upgrade(transparentUpgradeableProxy.address, boxv2.address)
    .then((tx) => tx.wait());

  const upgradedBox = await ethers.getContractAt(
    "BoxV2",
    transparentUpgradeableProxy.address
  );

  await upgradedBox.increment().then((tx) => tx.wait());

  console.log(await upgradedBox.counter());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
