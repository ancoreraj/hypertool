import { ApolloServer, gql } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";
import { organizations, users, groups, apps, resources } from "../controllers";

const jwtAuth = require('../middleware/jwtAuth');

import {
    resourceTypes,
    resourceStatuses,
    genders,
    countryCodes,
    userStatuses,
    organizationStatuses,
    userRoles,
    groupTypes,
    appStatuses,
    groupStatuses,
} from "../utils/constants";

const typeDefs = gql`
    scalar Date

    enum Gender {
        ${genders.join("\n")}
    }

    enum Country {
        ${countryCodes.join("\n")}
    }

    enum UserStatus {
        ${userStatuses.join("\n")}
    }

    enum UserRole {
        ${userRoles.join("\n")}
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        description: String!
        # Organization points to User directly, making each other mutually recursive.
        # Therefore, we flatten the data structure here.
        organization: ID!
        gender: Gender
        countryCode: Country
        pictureURL: String
        emailAddress: String!
        emailVerified: Boolean!
        birthday: Date
        status: UserStatus!
        role: UserRole!
        # Group points to User directly, making each other mutually recursive.
        # Therefore, we flatten the data structure here.
        groups: [ID!]!
        createdAt: Date!
        updatedAt: Date!
    }

    type UserPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [User!]!
    }

    enum OrganizationStatus {
        ${organizationStatuses.join("\n")}
    }

    type Organization {
        id: ID!
        name: String!
        description: String!
        users: [User!]!
        status: OrganizationStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type OrganizationPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Organization!]!
    }

    enum ResourceType {
        ${resourceTypes.join("\n")}
    }

    enum ResourceStatus {
        ${resourceStatuses.join("\n")}
    }

    input MySQLConfigurationInput {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    input PostgresConfigurationInput {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    input MongoDBConfigurationInput {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    input BigQueryConfigurationInput {
        key: String!
    }

    type MySQLConfiguration {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    type PostgresConfiguration {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    type MongoDBConfiguration {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    type BigQueryConfiguration {
        key: String!
    }

    type Resource {
        id: ID!
        name: String!
        description: String!
        creator: User!
        type: ResourceType!
        status: ResourceStatus!
        mysql: MySQLConfiguration
        postgres: PostgresConfiguration
        mongodb: MongoDBConfiguration
        bigquery: BigQueryConfiguration
        createdAt: Date!
        updatedAt: Date!
    }

    type ResourcePage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Resource!]!
    }

    enum AppStatus {
        ${appStatuses.join("\n")}
    }

    type App {
        id: ID!
        name: String!
        description: String!
        # Group points to App directly, making each other mutually recursive.
        # Therefore, we flatten the data structure here.
        groups: [ID!]!
        # Resource points to App directly, making each other mutually recursive.
        # Therefore, we flatten the data structure here.
        resources: [ID!]!
        # User points to App indirectly via groups attribute. Since groups is flattened
        # in User, we can use an aggregate type here.
        creator: User!
        status: AppStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type AppPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [App!]!
    }

    enum GroupType {
        ${groupTypes.join("\n")}
    }

    enum GroupStatus {
        ${groupStatuses.join("\n")}
    }

    type Group {
        id: ID!
        name: String!
        description: String!
        type: GroupType!
        users: [User!]!
        apps: [App!]!
        status: GroupStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type GroupPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Group!]!
    }

    type RemoveResult {
        success: Boolean!
    }

    type Mutation {
        createOrganization(
            name: String
            description: String
            users: [ID!]
        ): Organization!

        updateOrganization(
            name: String
            description: String
            users: [ID!]
        ): Organization!

        deleteOrganization(organizationId: ID!): RemoveResult!

        createUser(
            firstName: String!
            lastName: String!
            description: String
            organization: ID
            gender: Gender
            countryCode: Country
            pictureURL: String
            emailAddress: String!
            birthday: Date,
            role: UserRole,
            groups: [ID!]
        ): User!

        updateUser(
            firstName: String,
            lastName: String,
            description: String,
            gender: Gender,
            countryCode: Country,
            pictureURL: String,
            birthday: Date,
            role: UserRole,
            groups: [ID!]
        ): User!

        deleteUser(userId: ID!): RemoveResult!

        createGroup(
            name: String
            description: String
            users: [ID!]
            apps: [ID!]
        ): Group!

        updateGroup(
            name: String
            description: String
            users: [ID!]
            apps: [ID!]
        ): Group!

        deleteGroup(groupId: ID!): RemoveResult!

        createApp(
            name: String
            description: String
            groups: [ID!]
            resources: [ID!]
        ): App!

        updateApp(
            name: String
            description: String
            groups: [ID!]
            resources: [ID!]
        ): App!

        deleteApp(appId: ID!): RemoveResult!

        createResource(
            name: String!
            description: String
            type: ResourceType!
            mysql: MySQLConfigurationInput
            postgres: PostgresConfigurationInput
            mongodb: MongoDBConfigurationInput
            bigquery: BigQueryConfigurationInput
        ): Resource!

        updateResource(
            resourceId: ID!
            name: String
            description: String
            mysql: MySQLConfigurationInput
            postgres: PostgresConfigurationInput
            mongodb: MongoDBConfigurationInput
            bigquery: BigQueryConfigurationInput
        ): Resource!

        deleteResource(resourceId: ID!): RemoveResult!
    }

    type Query {
        getOrganizations(page: Int, limit: Int): OrganizationPage!
        getOrganizationById(organizationId: ID!): Organization!

        getUsers(page: Int, limit: Int): UserPage!
        getUserById(userId: ID!): User!

        getGroups(page: Int, limit: Int): GroupPage!
        getGroupById(groupId: ID!): Group!

        getApps(page: Int, limit: Int): AppPage!
        getAppById(appId: ID!): App!

        getResources(page: Int, limit: Int): ResourcePage!
        getResourceById(resourceId: ID!): Resource!
    }
`;

const resolvers = {
    Date: new GraphQLScalarType({
        name: "Date",
        parseValue(value: string) {
            return new Date(value);
        },
        serialize(value: Date) {
            return value.toISOString();
        },
    }),
    Mutation: {
        createOrganization: async (parent, values, context) =>
            organizations.create(context.request, values),

        updateOrganization: async (parent, values, context) =>
            organizations.update(
                context.request,
                values.organizationId,
                values
            ),

        deleteOrganization: async (parent, values, context) =>
            organizations.remove(context.request, context.organizationId),

        createUser: async (parent, values, context) =>
            users.create(context.request, values),

        updateUser: async (parent, values, context) =>
            users.update(context.request, values.userId, values),

        deleteUser: async (parent, values, context) =>
            users.remove(context.request, context.userId),

        createGroup: async (parent, values, context) =>
            groups.create(context.request, values),

        updateGroup: async (parent, values, context) =>
            groups.update(context.request, values.groupId, values),

        deleteGroup: async (parent, values, context) =>
            groups.remove(context.request, context.groupId),

        createApp: async (parent, values, context) =>
            apps.create(context.request, values),

        updateApp: async (parent, values, context) =>
            apps.update(context.request, values.appId, values),

        deleteApp: async (parent, values, context) =>
            apps.remove(context.request, context.appId),

        createResource: async (parent, values, context) =>
            resources.create(context.request, values),

        updateResource: async (parent, values, context) =>
            resources.update(context.request, values.resourceId, values),

        deleteResource: async (parent, values, context) =>
            resources.remove(context.request, context.resourceId),
    },
    Query: {
        getOrganizations: async (parent, values, context) =>
            organizations.list(context.request, values),

        getOrganizationById: async (parent, values, context) =>
            organizations.getById(context.request, values.organizationId),

        getUsers: async (parent, values, context) =>
            users.list(context.request, values),

        getUserById: async (parent, values, context) =>
            users.getById(context.request, values.userId),

        getGroups: async (parent, values, context) =>
            groups.list(context.request, values),

        getGroupById: async (parent, values, context) =>
            groups.getById(context.request, values.groupId),

        getApps: async (parent, values, context) =>
            apps.list(context.request, values),

        getAppById: async (parent, values, context) =>
            apps.getById(context.request, values.appId),

        getResources: async (parent, values, context) =>
            resources.list(context.request, values),

        getResourceById: async (parent, values, context) =>
            resources.getById(context.request, values.resourceId),
    },
};

const attachRoutes = async (app: any) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (context) => ({
      request: context.req,
    }),
  });
  await server.start();
  app.use("/graphql/v1/private", jwtAuth);
  server.applyMiddleware({
    app,
    path: "/graphql/v1/private",
  });
};

export { attachRoutes };
