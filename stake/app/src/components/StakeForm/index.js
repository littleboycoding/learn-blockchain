import { useState } from "react";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import useStake from "../../hooks/stake";
import { CircularProgress } from "@mui/material";

const numberRegExp = new RegExp(/^[0-9]*$/);

function StakeForm({ address }) {
  const [stakeValue, setStakeValue] = useState("");
  const { pending, stake } = useStake(address, stakeValue, () =>
    setStakeValue("")
  );

  const isNumber = numberRegExp.test(stakeValue);

  const handleChange = (event) => {
    setStakeValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isNumber && stakeValue.length > 0) {
      await stake();
    }
  };

  if (pending) return <CircularProgress />;

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1}>
        <TextField
          error={!isNumber}
          helperText={!isNumber && "Require integer"}
          value={stakeValue}
          onChange={handleChange}
          label="Stake"
        />
        <Button type="submit" variant="contained">
          Stake
        </Button>
      </Stack>
    </form>
  );
}

export default StakeForm;
