import { useContractFunction } from "@usedapp/core";

import createStakeContract from "../../contracts/Stake";
import createERC20Contract from "../../contracts/ERC20";
import { useEffect, useState } from "react";

function useStake(address, amount, callback = () => {}) {
  const [pending, setPending] = useState(false);
  // const [callback, setCallback] = useState(() => {});

  const approve = useContractFunction(createERC20Contract(address), "approve", {
    transactionName: "approve",
  });
  const stake = useContractFunction(
    createStakeContract(process.env.REACT_APP_STAKE_ADDRESS),
    "stake",
    {
      transactionName: "stake",
    }
  );

  useEffect(() => {
    if (approve.state.status === "Success") {
      approve.resetState();
      stake.send(address, amount);
    }
    if (stake.state.status === "Success") {
      stake.resetState();
      callback();
      setPending(false);
    }
  }, [approve, stake, address, amount, callback]);

  return {
    pending: pending,
    stake: async () => {
      if (!pending) {
        setPending(true);
        await approve.send(process.env.REACT_APP_STAKE_ADDRESS, amount);
      }
    },
  };
}

export default useStake;
