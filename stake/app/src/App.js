import { useEffect, useState } from "react";
import { useEthers, useNotifications } from "@usedapp/core";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import TokenTab from "./components/TokenTab";
import TokenInfo from "./components/TokenInfo";
import Membership from "./components/Membership";

import tokens from "./tokens";
import Snackbar from "@mui/material/Snackbar";

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const { account } = useEthers();
  const { notifications } = useNotifications();
  const [status, setStatus] = useState("");

  const { image, name, address } = tokens[tabIndex];
  const connected = account !== undefined;

  const handleChange = (_, value) => {
    setTabIndex(value);
  };

  const handleClose = () => {
    setStatus("");
  };

  useEffect(() => {
    notifications
      .filter((n) => n.type === "transactionSucceed")
      .forEach((n) => {
        switch (n.transactionName) {
          case "approve":
            setStatus("Allownance approved");
            break;
          case "stake":
            setStatus("Staking has been completed");
            break;
          default:
            break;
        }
      });
  }, [notifications]);

  return (
    <Container sx={{ bgcolor: "white", py: 1 }}>
      <Box p={1}>
        <Box textAlign="right">
          <Membership />
        </Box>
        <Typography color="primary" variant="h1">
          TOKEN STAKE
        </Typography>
      </Box>
      <TokenTab onChange={handleChange} value={tabIndex} tokens={tokens} />
      <Box p={1}>
        {connected ? (
          <TokenInfo image={image} name={name} address={address} />
        ) : (
          <Typography variant="subtitle1" color="gray">
            Please connect to wallet to get start
          </Typography>
        )}
      </Box>
      <Snackbar
        open={!!status}
        message={status}
        onClose={handleClose}
        autoHideDuration={3000}
      />
    </Container>
  );
}

export default App;
