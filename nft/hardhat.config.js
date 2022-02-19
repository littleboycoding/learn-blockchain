require("dotenv/config");
require("@nomiclabs/hardhat-waffle");
const { task } = require("hardhat/config");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("ipfs", "Manipulatee data on IPFS protocol")
  .addPositionalParam("method", "`add` or `list`")
  .addOptionalPositionalParam("name", "name of token")
  .addOptionalPositionalParam("description", "description of token")
  .addOptionalPositionalParam("filepath", "path to image file")
  .addParam("url", "IPFS node url", "http://localhost:5001/api/v0")
  .setAction(async (taskArgs, hre) => {
    const ipfs = require("ipfs-http-client");
    const path = require("path");
    const fs = require("fs/promises");
    const sharp = require("sharp");

    const { method, name, description, filepath, url } = taskArgs;

    const client = ipfs.create({ url });

    switch (method) {
      case "add":
        if (!(method && name && description && filepath))
          return console.error(
            "Missing required, method, name, description, filepath"
          );

        const webp = await sharp(filepath).webp().toBuffer();
        const { cid } = await client.add(webp);
        const image = `https://ipfs.io/ipfs/${cid}`;

        const metadata = {
          name,
          description,
          image,
        };

        const jsonifiedMetadata = JSON.stringify(metadata);

        const result = await client.add(jsonifiedMetadata);

        await fs.writeFile(
          path.join(path.resolve(__dirname, "metadatas"), result.cid + ".json"),
          jsonifiedMetadata
        );

        console.log(`https://ipfs.io/ipfs/${result.cid}`);
        break;
      case "list":
        const metadataPath = path.resolve(__dirname, "metadatas");
        const metadataList = await fs.readdir(metadataPath);
        const metadatas = {};

        const contents = await Promise.all(
          metadataList.map((m) =>
            fs.readFile(path.join(metadataPath, m), { encoding: "utf-8" })
          )
        );

        for (let k in metadataList) {
          metadatas[metadataList[k]] = contents[k];
        }
        console.log(metadatas);
        break;
      default:
        console.error("Invalid method");
    }
  });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.GATEWAY_URL,
      accounts: [process.env.PRIVATE_KEY_1, process.env.PRIVATE_KEY_2],
    },
  },
};
