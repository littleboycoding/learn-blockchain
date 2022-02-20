// Use `npx hardhat deploy` instead

const { ethers, upgrades } = require("hardhat");

async function main() {
  const Box3 = await ethers.getContractFactory("BoxV3");
  const box3 = await upgrades.upgradeProxy("PROXY_ADDRESS", Box3);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
