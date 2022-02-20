// Use `npx hardhat deploy` instead

const { ethers, upgrades } = require("hardhat");

async function main() {
  const Box3 = await ethers.getContractFactory("BoxV3");
  const box3 = await upgrades.upgradeProxy(
    "0x1c3f1059896eB68D0de158CaC1aDDcdfA42a7214",
    Box3
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
