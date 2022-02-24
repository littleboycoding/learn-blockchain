import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function TokenTab(props) {
  const tabs = props.tokens.map((t) => <Tab key={t.address} label={t.name} />);

  return (
    <Box borderBottom={1} borderColor="divider">
      <Tabs {...props}>{tabs}</Tabs>
    </Box>
  );
}

export default TokenTab;
