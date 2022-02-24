import { useCall } from "@usedapp/core";

import createStakeContrcat from "../../contracts/Stake";

function useStakeBalance(address, account) {
  const result = useCall({
    contract: createStakeContrcat(process.env.REACT_APP_STAKE_ADDRESS),
    method: "stakingBalances",
    args: [address, account],
  });

  return result;
}

export default useStakeBalance;
