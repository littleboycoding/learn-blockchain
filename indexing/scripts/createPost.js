require("dotenv/config");
const hre = require("hardhat");
const faker = require("@faker-js/faker");

const ADDR = process.env.CONTRACT_ADDRESS;

async function main() {
  const Post = await hre.ethers.getContractFactory("Post");
  const signer = (await hre.ethers.getSigners())[0];
  const post = new hre.ethers.Contract(ADDR, Post.interface, signer);

  const createdPost = await post.createPost(faker.lorem.slug());

  await createdPost.wait();

  console.log("Created post", createdPost);
}

main()
  .then(() => process.exit(0))

  .catch((error) => {
    console.error(error);


    process.exit(1);

  });
