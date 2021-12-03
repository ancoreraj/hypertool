import { ApolloServer, gql } from "apollo-server-express";
import { types } from "./typeDefinitions";
import { users } from "../controllers";

const typeDefs = gql`
    ${types}

    type Mutation {
        loginWithGoogle (
            token: String!
        ): String!
    }
`;

const resolvers = {
    Mutation: {
        loginWithGoogle: async (parent, values, context) =>
            users.loginWithGoogle(context.request, values),
    },
};

const attachRoutes = async (app) => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();
    server.applyMiddleware({ app, path: "/graphql/v1/public" });
};

export { attachRoutes };