const hre = require("hardhat");

async function main() {
  const initialSupply = (1 * 10 ** 18).toString();

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(initialSupply);

  await token.deployed();

  console.log("Token deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
