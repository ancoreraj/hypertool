import type { FunctionComponent, ReactElement } from "react";

import { Typography, FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";

import { TextField, Checkbox } from "../../components";

const TextFieldHelp = styled(Typography)(({ theme }) => ({
  display: "flex",
  marginTop: 4,
  flexDirection: "column",
  marginLeft: -8,
  marginBottom: 0,
  paddingBottom: 0,
}));

const ResourceNameTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
})) as any;

const DescriptionTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  marginTop: theme.spacing(3),
})) as any;

const HostTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  marginTop: theme.spacing(3),
})) as any;

const PortTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  marginTop: theme.spacing(3),
})) as any;

const DatabaseNameTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  marginTop: theme.spacing(3),
})) as any;

const DatabaseUserNameTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  marginTop: theme.spacing(3),
})) as any;

const DatabasePasswordTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  marginTop: theme.spacing(3),
})) as any;

const SSLLabel = styled(FormControlLabel)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.background.default),
  marginTop: theme.spacing(2),
}));

const PostgresForm: FunctionComponent = (): ReactElement => {
  return (
    <>
      <ResourceNameTextField
        name="resourceName"
        required={true}
        id="resourceName"
        label="Resource Name"
        size="small"
        variant="outlined"
        fullWidth={true}
        help={
          <TextFieldHelp variant="caption">
            The resource name will help you identify the resource across
            Hypertool, including HTX and JavaScript code.
          </TextFieldHelp>
        }
      />

      <DescriptionTextField
        name="description"
        id="description"
        label="Description"
        size="small"
        variant="outlined"
        fullWidth={true}
        multiline={true}
        rows={2}
      />

      <HostTextField
        name="host"
        required={true}
        id="host"
        label="Host"
        size="small"
        variant="outlined"
        fullWidth={true}
      />

      <PortTextField
        name="port"
        required={true}
        id="port"
        label="Port"
        size="small"
        variant="outlined"
        fullWidth={true}
        type="number"
      />

      <DatabaseNameTextField
        name="databaseName"
        required={true}
        id="databaseName"
        label="Database Name"
        size="small"
        variant="outlined"
        fullWidth={true}
      />

      <DatabaseUserNameTextField
        name="databaseUserName"
        required={true}
        id="databaseUserName"
        label="User Name"
        size="small"
        variant="outlined"
        fullWidth={true}
      />

      <DatabasePasswordTextField
        name="databasePassword"
        required={true}
        id="databasePassword"
        label="Password"
        size="small"
        variant="outlined"
        type="password"
        fullWidth={true}
      />

      <SSLLabel
        control={<Checkbox name="connectUsingSSL" defaultChecked={false} />}
        label="Connect using SSL"
      />
    </>
  );
};

export default PostgresForm;
