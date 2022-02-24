import { useContractFunction } from "@usedapp/core";

import createERC20Contrcat from "../../contracts/ERC20";

function useApprove(address) {
  return useContractFunction(createERC20Contrcat(address), "approve");
}

export default useApprove;
