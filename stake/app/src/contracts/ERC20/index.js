import { Contract } from "ethers";

import ERC20_ABI from "../../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json";

function createContract(address) {
  return new Contract(address, ERC20_ABI.abi);
}

export default createContract;
