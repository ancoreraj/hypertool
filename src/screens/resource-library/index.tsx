import type { FunctionComponent, ReactElement } from "react";

import { useCallback } from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Button,
  Icon,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router";

import ResourcesTable from "./ResourcesTable";

const Root = styled("section")(({ theme }) => ({
  width: "100%",
}));

const Title = styled(Typography)(({ theme }) => ({}));

const WorkspaceToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}));

const ActionContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
}));

const Search = styled(TextField)(({ theme }) => ({
  width: 264,
  marginRight: theme.spacing(2),
})) as any;

const ActionIcon = styled(Icon)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const TableContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(4),

}));

const ResourceLibrary: FunctionComponent = (): ReactElement => {
  const navigate = useNavigate();

  const handleCreateNew = useCallback(() => {
    navigate("/resources/new");
  }, []);

  return (
    <Root>
      <AppBar position="static" elevation={1}>
        <WorkspaceToolbar>
          <Title>Resource Library</Title>
          <ActionContainer>
            <Search
              label=""
              placeholder="Search"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon fontSize="small">search</Icon>
                  </InputAdornment>
                ),
              }}
            />
            <Button size="small" onClick={handleCreateNew}>
              <ActionIcon fontSize="small">add_circle</ActionIcon>
              Create New
            </Button>
          </ActionContainer>
        </WorkspaceToolbar>
      </AppBar>
      <TableContainer>
        <ResourcesTable selectable={false} />
      </TableContainer>
    </Root>
  );
};

export default ResourceLibrary;
