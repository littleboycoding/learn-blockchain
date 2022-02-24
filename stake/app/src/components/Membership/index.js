import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEthers } from "@usedapp/core";

function Membership() {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const connected = account !== undefined;

  if (!connected)
    return (
      <Button onClick={activateBrowserWallet} variant="outlined">
        Connect
      </Button>
    );

  return (
    <Button color="warning" onClick={deactivate} variant="outlined">
      <Box>
        <Typography>Discconect</Typography>
        <Typography color="primary" variant="caption">
          {account.slice(0, 7)}...
        </Typography>
      </Box>
    </Button>
  );
}

export default Membership;
