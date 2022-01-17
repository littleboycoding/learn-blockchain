import { ethers } from "ethers";

const ABI = `[{"inputs":[],"stateMutability":"payable","type":"constructor"},{"inputs":[],"name":"fund","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"retrive","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]`;
const ADDRESS = "0x946c0080a972b583b8fd960044cc77200653fb1c";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_ENDPOINT = process.env.INFURA_ENDPOINT;

console.table({ ABI, ADDRESS, PRIVATE_KEY, INFURA_ENDPOINT });

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(INFURA_ENDPOINT);
  const signer = new ethers.Wallet(PRIVATE_KEY as string, provider);

  // FundMe contract
  const fundMe = new ethers.Contract(ADDRESS, ABI, signer);

  // Retrive
  console.log("Retriving balance");
  const wei = await fundMe.retrive();
  const eth = ethers.utils.formatEther(wei);
  console.log(eth);

  // Fund
  console.log("Now funding");
  const fundWei = ethers.utils.parseEther("0.03");
  await fundMe.fund({ value: fundWei });
  console.log("Funded", fundWei);

  // Withdraw
  console.log("Now withdrawing");
  await fundMe.withdraw();
}

main();
