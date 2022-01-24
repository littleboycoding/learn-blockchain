require("dotenv/config");
const hre = require("hardhat");

const ADDR = process.env.CONTRACT_ADDRESS;

async function main() {
  const RNG = await hre.ethers.getContractFactory("RNG");
  const rng = new hre.ethers.Contract(
    ADDR,
    RNG.interface,
    await hre.ethers.getSigner(0)
  );

  rng.on("GetRandomized", () => {
    console.log("Getting randomized request");
    const rand = Math.random();
    rng.receiveRandomized(rand.toString());
  });

  await new Promise(() => {});
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
