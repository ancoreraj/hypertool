import type { FunctionComponent, ReactElement } from "react";

import { useCallback, useEffect } from "react";
import {
  Button,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router";

import OrganizationForm from "./OrganizationForm";
import Wrap from "../../components/Wrap";

const TitleContainer = styled(Typography)(({ theme }) => ({
  color: "white",
  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(0)
  }
}))

const FormContainer = styled("div")(({ theme }) => ({
  height: "calc(100vh - 200px)",
}));

const ActionContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
}));

const CreateAction = styled(Button)(({ theme }) => ({
  width: 144,
  marginLeft: theme.spacing(2)
}));

interface FormValues {
  name: string;
  description: string;
}

const initialValues: FormValues = {
  name: "",
  description: "",
};

const validationSchema = yup.object({
  name: yup
    .string()
    .max(128, "Name should be 128 characters or less")
    .required("Name is required"),
  description: yup
    .string()
    .max(512, "Description should be 512 characters or less"),
});

const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization(
    $name: String!
    $description: String
    $users: [ID!]
  ) {
    createOrganization(
      name: $name
      description: $description
      users: $users
    ) {
      id
    }
  }
`;

const UPDATE_USER = gql`
mutation UpdateUser(
  $userId: ID!
  $organization: ID!
) {
  updateUser(
    userId: $userId
    organization: $organization
  ) {
    id
  }
}
`;

const NewOrganization: FunctionComponent = (): ReactElement => {
  // TODO: Destructure `error`, check for non-null, send to sentry
  const [
    createOrganization,
    { loading: creatingOrganization, data: newOrganization },
  ] = useMutation(CREATE_ORGANIZATION);
  const [updateUser, { loading: updatingUser, data: updatedUser }] = useMutation(UPDATE_USER);
  const theme = useTheme();
  const navigate = useNavigate();
  const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));
  const session = localStorage.getItem("session") as string;

  useEffect(() => {
    if (newOrganization) {
      updateUser({
        variables: {
          userId: JSON.parse(session)?.user?._id,
          organization: newOrganization.createOrganization.id
        },
      });
      if (updatedUser) {
        navigate('/apps');
      }
    }
  }, [navigate, newOrganization, session, updateUser, updatedUser]);



  const handleSubmit = useCallback(
    (values: FormValues, helpers: FormikHelpers<FormValues>): any => {
      if (session) {
        createOrganization({
          variables: {
            ...values,
            users: [JSON.parse(session)?.user?._id]
          },
        });
      }

    },
    [createOrganization, session]
  );

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {(formik) => (
          <>

            <TitleContainer>Create your organization</TitleContainer>
            <Wrap
              when={smallerThanLg}
              wrapper={Container}
              style={{ height: "calc(100vh - 156px)" }}
            >
              <Wrap when={!smallerThanLg} wrapper={FormContainer}>
                <OrganizationForm />
              </Wrap>
            </Wrap>

            <ActionContainer>
              <CreateAction
                onClick={() => formik.submitForm()}
                variant="contained"
                size="small"
                disabled={creatingOrganization || updatingUser}
              >
                Create
                {(!creatingOrganization && !updatingUser) && (
                  <CheckCircleOutline fontSize="small" sx={{ ml: 1 }} />
                )}
                {(creatingOrganization || updatingUser) && (
                  <CircularProgress size="14px" sx={{ ml: 1 }} />
                )}
              </CreateAction>
            </ActionContainer>
          </>
        )}
      </Formik>
    </div>
  );
};

export default NewOrganization;
