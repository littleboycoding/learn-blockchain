import StakeForm from "../StakeForm";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { utils } from "ethers";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import useStakeBalance from "../../hooks/stakeBalance";

function TokenInfo({ image, name, address }) {
  const { account } = useEthers();
  const balance = useTokenBalance(address, account);
  const stakeBalance = useStakeBalance(address, account);

  if (!balance || !stakeBalance) return <CircularProgress />;

  return (
    <Box>
      <Stack alignItems="flex-start" spacing={2}>
        <Box>
          <img height={100} src={image} alt="token logo" />
          <Typography color="primary" variant="h2">
            {name}
          </Typography>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography>Balance {utils.formatEther(balance)}</Typography>
            <Typography>
              Staked {utils.formatEther(stakeBalance.value[0])}
            </Typography>
          </Stack>
        </Box>
        <StakeForm address={address} />
      </Stack>
    </Box>
  );
}

export default TokenInfo;
