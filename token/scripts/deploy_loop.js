// Dunno, just want to test performance if smart contract hold big data in it.
const hre = require("hardhat");

async function main() {
    const Storage = await hre.ethers.getContractFactory("Storage");
    const storage = await Storage.deploy();
    await storage.deployed();

    const promises = [];

    for (let i = 0; i < 5000; i++) {
        promises.push(storage.deploy());
    }

    await Promise.all(promises);

    console.time("Query");
    console.log((await storage.getToken(4999)).length);
    console.timeEnd("Query");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
