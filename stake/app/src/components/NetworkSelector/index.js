import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import { NETWORKS } from "../../networks";
import { getChainName } from "@usedapp/core";
import { useState } from "react";

/**
 * @deprecated
 */
function NetworkSelector() {
  const [open, setOpen] = useState(false);

  const networks = NETWORKS.map((id) => (
    <MenuItem key={id}>{getChainName(id)}</MenuItem>
  ));

  return (
    <>
      <Button color="secondary" variant="outlined">
        Networks
      </Button>
      <Menu open={open}>{networks}</Menu>
    </>
  );
}

export default NetworkSelector;
