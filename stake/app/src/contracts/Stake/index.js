import { Contract } from "ethers";

import STAKE_ABI from "../../artifacts/contracts/Stake.sol/Stake.json";

function createContract(address) {
  return new Contract(address, STAKE_ABI.abi);
}

export default createContract;
