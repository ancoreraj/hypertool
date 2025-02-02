import { FunctionComponent, ReactElement, useCallback } from "react";

import {
  Typography,
  Divider,
  Container,
  AppBar,
  Toolbar,
  Button,
  Icon,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Formik } from "formik";
import { useParams } from "react-router";
import { gql, useQuery, useMutation } from "@apollo/client";

import MySQLForm from "../new-resource/MySQLForm";
import PostgresForm from "../new-resource/PostgresForm";
import MongoDBForm from "../new-resource/MongoDBForm";
import BigQueryForm from "../new-resource/BigQueryForm";

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

const ProgressContainer = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100vh - 192px)",
  justifyContent: "center",
  alignItems: "center",
}));

const Root = styled("div")(({ theme }) => ({
  width: "100%",
}));

const Left = styled("div")(({ theme }) => ({
  maxWidth: 280,
  marginRight: theme.spacing(4),
}));

const Right = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100vh - 192px)",
}));

const Help = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.getContrastText(theme.palette.background.default),
  lineHeight: 1.5,
  marginTop: theme.spacing(1),
})) as any;

const ActionIcon = styled(Icon)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const Content = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  padding: theme.spacing(4),
}));

const GET_RESOURCE = gql`
  query GetResource($resourceId: ID!) {
    getResourceById(resourceId: $resourceId) {
      id
      name
      description
      type
      status
      createdAt
      mysql {
        host
        port
        databaseName
        databaseUserName
        databasePassword
        connectUsingSSL
      }
      postgres {
        host
        port
        databaseName
        databaseUserName
        databasePassword
        connectUsingSSL
      }
      mongodb {
        host
        port
        databaseName
        databaseUserName
        databasePassword
        connectUsingSSL
      }
      bigquery {
        key
      }
    }
  }
`;

const UPDATE_RESOURCE = gql`
  mutation UpdateResource(
    $resourceId: ID!
    $name: String!
    $description: String
    $mysql: MySQLConfigurationInput
    $postgres: PostgresConfigurationInput
    $mongodb: MongoDBConfigurationInput
    $bigquery: BigQueryConfigurationInput
  ) {
    updateResource(
      resourceId: $resourceId
      name: $name
      description: $description
      mysql: $mysql
      postgres: $postgres
      mongodb: $mongodb
      bigquery: $bigquery
    ) {
      id
    }
  }
`;

interface ResourceFormByType {
  [key: string]: FunctionComponent;
}

const resourceFormByType: ResourceFormByType = {
  mysql: MySQLForm,
  postgres: PostgresForm,
  mongodb: MongoDBForm,
  bigquery: BigQueryForm,
};

const EditResource: FunctionComponent = (): ReactElement => {
  const { resourceId } = useParams();
  // TODO: Destructure `error`, check for non-null, send to sentry
  const { loading, data, refetch } = useQuery(GET_RESOURCE, {
    variables: {
      resourceId,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [updateResource] =
    useMutation(UPDATE_RESOURCE);
  const {
    name = "<unavailable>",
    description = "<unavailable>",
    type = "<unavailable>",
    ...others
  } = data?.getResourceById ?? {};

  const handleCreateNew = () => { };

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleSubmit = useCallback(
    (values: any) => {
      const { resourceName: name, description, ...configuration } = values;
      const { __typename, ...sanitizedConfiguration } = configuration;
      updateResource({
        variables: {
          resourceId,
          name,
          description,
          [type as string]: sanitizedConfiguration,
        },
      });
    },
    [resourceId, type, updateResource]
  );

  const renderProgress = () => (
    <ProgressContainer>
      <CircularProgress size="28px" />
    </ProgressContainer>
  );

  const renderForms = () => {
    const Form = resourceFormByType[type];

    return <Form />;
  };

  if (loading) {
    return renderProgress();
  }

  return (
    <Formik
      initialValues={{
        resourceName: name,
        description,
        /* Since the form expects flat data, spread the configuration. */
        ...others[type],
      }}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Root>
          <AppBar position="static" elevation={1}>
            <WorkspaceToolbar>
              <Title>Edit Resource</Title>
              <ActionContainer>
                <Button
                  size="small"
                  onClick={handleCreateNew}
                  color="inherit"
                  sx={{ mr: 2 }}
                  disabled={loading}
                >
                  <ActionIcon fontSize="small">cancel</ActionIcon>
                  Disable
                </Button>
                <Button
                  size="small"
                  color="inherit"
                  onClick={handleCreateNew}
                  sx={{ mr: 2 }}
                  disabled={loading}
                >
                  <ActionIcon fontSize="small">delete</ActionIcon>
                  Delete
                </Button>
                <Button
                  size="small"
                  onClick={handleRefresh}
                  color="inherit"
                  sx={{ mr: 2 }}
                  disabled={loading}
                >
                  <ActionIcon fontSize="small">refresh</ActionIcon>
                  Refresh
                </Button>
                <Button
                  size="small"
                  onClick={() => formik.submitForm()}
                  color="inherit"
                  disabled={loading}
                >
                  <ActionIcon fontSize="small">save</ActionIcon>
                  Save
                </Button>
              </ActionContainer>
            </WorkspaceToolbar>
          </AppBar>
          {!loading && (
            <Content>
              <Left>
                <Help component="p" variant="caption">
                  Resources let you connect to your database or API. Once you
                  add a resource here, you can choose which app has access to
                  which resource.
                </Help>
              </Left>

              <Divider orientation="vertical" flexItem={true} sx={{ mr: 4 }} />

              <Right>{renderForms()}</Right>
            </Content>
          )}
        </Root>
      )}
    </Formik>
  );
};

export default EditResource;
