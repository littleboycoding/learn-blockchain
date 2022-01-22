require("dotenv/config");
const express = require("express");
const hre = require("hardhat");
const { createClient } = require("redis");

const PORT = process.env.PORT || 3000;
const ADDR = process.env.CONTRACT_ADDRESS;
const REDIS_CONNECTION =
  process.env.REDIS_CONNECTION || "redis://localhost:6379";

/**
 * Create flushed redis client
 */
async function initializeRedisClient(conn) {
  const client = createClient(conn);

  client.on("error", (err) =>
    console.error("An error occured on Redis server", err)
  );
  client.on("connect", () => console.log("Connected to Redis server"));

  await client.connect();
  await client.flushAll();

  return client;
}

async function queryHistoricalPost(post) {
  const filter = post.filters.CreatePost();
  const query = await post.queryFilter(filter);

  return query;
}

async function getPostContract() {
  const Post = await hre.ethers.getContractFactory("Post");
  const signer = (await hre.ethers.getSigners())[0];
  const post = new hre.ethers.Contract(ADDR, Post.interface, signer);

  return post;
}

/**
 * Main entry
 */
async function main() {
  const client = await initializeRedisClient(REDIS_CONNECTION);
  const app = express();

  const post = await getPostContract();
  const query = await queryHistoricalPost(post);

  await client.rPush(
    "post",
    query.map((q) => q.args[0])
  );
  post.on("CreatePost", (_title) => {
    client.rPush("post", _title);
    console.log("New post created", _title);
  });

  app.get("/post", async (_, res) => {
    const post = await client.lRange("post", 0, -1);
    res.json(post);
  });

  app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
  });
}

main();
