// Use `npx hardhat deploy` and `npx hardhat upgrade` instead

const { ethers, upgrades } = require("hardhat");

async function main() {
  const Box = await ethers.getContractFactory("Box");
  const box = await upgrades.deployProxy(Box);
  await box.deployed();

  const BoxV2 = await ethers.getContractFactory("BoxV2");
  const boxv2 = await upgrades.upgradeProxy(box.address, BoxV2);

  console.log("Upgraded", box.address, boxv2.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
