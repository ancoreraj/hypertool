import type { FunctionComponent, ReactElement } from "react";

import { useState } from "react";
import {  } from "@mui/material";
import { styled } from "@mui/material/styles";

import { MiniDrawer, PrimaryAppBar } from "../components";

const Root = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "row",
}));

const WorkspaceLayout: FunctionComponent = (): ReactElement => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Root>
      <PrimaryAppBar open={open} onDrawerOpen={handleDrawerOpen} />
      <MiniDrawer open={open} onDrawerClose={handleDrawerClose} />
    </Root>
  );
};

export default WorkspaceLayout;
