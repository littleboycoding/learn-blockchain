const hre = require("hardhat");

async function main() {
  const Post = await hre.ethers.getContractFactory("Post");
  const post = await Post.deploy();

  await post.deployed();

  console.log("Post deployed to:", post.address);
}

main()
  .then(() => process.exit(0))

  .catch((error) => {
    console.error(error);


    process.exit(1);

  });
