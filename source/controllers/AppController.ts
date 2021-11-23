import joi from "joi";

import type { App, ExternalApp, Member, AppPage } from "../types";

import { constants, BadRequestError, NotFoundError } from "../utils";
import { AppModel } from "../models";

const createSchema = joi.object({
  name: joi.string().min(1).max(128).allow(""),
  description: joi.string().min(0).max(512).allow(""),
  members: joi.array().items(joi.string().regex(constants.identifierPattern)),
  resources: joi.array().items(joi.string().regex(constants.identifierPattern)),
  creator: joi.string().regex(constants.identifierPattern),
});

const updateSchema = joi.object({
  name: joi.string().min(1).max(128).allow(""),
  description: joi.string().min(0).max(512).allow(""),
  members: joi.array().items(joi.string().regex(constants.identifierPattern)),
  resources: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const filterSchema = joi.object({
  page: joi.number().integer().default(0),
  limit: joi
    .number()
    .integer()
    .min(constants.paginateMinLimit)
    .max(constants.paginateMaxLimit)
    .default(constants.paginateMinLimit),
});

const toExternal = (app: App): ExternalApp => {
  const { name, description, members, resources, creator, status } = app;

  return {
    name,
    description,
    members:
      members.length > 0
        ? typeof members[0] === "string"
          ? members
          : members.map((member) => member.id)
        : [],
    resources:
      resources.length > 0
        ? typeof resources[0] === "string"
          ? resources
          : resources.map((member) => member.id)
        : [],
    creator: typeof creator === "string" ? creator : (creator as Member).id,
    status,
  };
};

const create = async (context, attributes): Promise<ExternalApp> => {
  const { error, value } = createSchema.validate(attributes, {
    stripUnknown: true,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  // TODO: Check if value.members, value.resources, and value.creator are correct.
  const newApp = new AppModel({
    ...value,
    status: "private",
  });
  await newApp.save();

  return toExternal(newApp);
};

const list = async (context, parameters): Promise<AppPage> => {
  const { error, value } = filterSchema.validate(parameters);
  if (error) {
    throw new BadRequestError(error.message);
  }

  // TODO: Update filters
  const filters = {
    status: {
      $ne: "deleted",
    },
  };
  const { page, limit } = value;

  const apps = await (AppModel as any).paginate(filters, {
    limit,
    page: page + 1,
    lean: true,
    leanWithId: true,
    pagination: true,
    sort: {
      updatedAt: -1,
    },
  });

  return {
    totalRecords: apps.totalDocs,
    totalPages: apps.totalPages,
    previousPage: apps.prevPage ? apps.prevPage - 1 : -1,
    nextPage: apps.nextPage ? apps.nextPage - 1 : -1,
    hasPreviousPage: apps.hasPrevPage,
    hasNextPage: apps.hasNextPage,
    records: apps.docs.map(toExternal),
  };
};

const listByIds = async (context, appIds: string[]): Promise<ExternalApp[]> => {
  const unorderedApps = await AppModel.find({
    _id: { $in: appIds },
    status: { $ne: "deleted" },
  }).exec();
  const object = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const app of unorderedApps) {
    object[app._id] = app;
  }
  // eslint-disable-next-line security/detect-object-injection
  return appIds.map((key) => toExternal(object[key]));
};

const getById = async (context, appId: string): Promise<ExternalApp> => {
  if (!constants.identifierPattern.test(appId)) {
    throw new BadRequestError("The specified app identifier is invalid.");
  }

  // TODO: Update filters
  const filters = {
    _id: appId,
    status: { $ne: "deleted" },
  };
  const app = await AppModel.findOne(filters as any).exec();

  /* We return a 404 error, if we did not find the app. */
  if (!app) {
    throw new NotFoundError("Cannot find a app with the specified identifier.");
  }

  return toExternal(app);
};

const update = async (
  context,
  appId: string,
  attributes
): Promise<ExternalApp> => {
  if (!constants.identifierPattern.test(appId)) {
    throw new BadRequestError("The specified app identifier is invalid.");
  }

  const { error, value } = updateSchema.validate(attributes, {
    stripUnknown: true,
  });
  if (error) {
    throw new BadRequestError(error.message);
  }

  // TODO: Update filters
  // TODO: Check if value.members and value.resources are correct.
  const app = await AppModel.findOneAndUpdate(
    {
      _id: appId,
      status: { $ne: "deleted" },
    },
    value,
    {
      new: true,
      lean: true,
    }
  ).exec();

  if (!app) {
    throw new NotFoundError(
      "An app with the specified identifier does not exist."
    );
  }

  return toExternal(app);
};

const publish = async (context, appId: string): Promise<ExternalApp> => {
  if (!constants.identifierPattern.test(appId)) {
    throw new BadRequestError("The specified app identifier is invalid.");
  }

  // TODO: Update filters
  const app = await AppModel.findOneAndUpdate(
    {
      _id: appId,
      status: { $ne: "deleted" },
    },
    {
      status: "public",
    },
    {
      new: true,
      lean: true,
    }
  );

  if (!app) {
    throw new NotFoundError(
      "An app with the specified identifier does not exist."
    );
  }

  return toExternal(app);
};

const unpublish = async (context, appId: string): Promise<ExternalApp> => {
  if (!constants.identifierPattern.test(appId)) {
    throw new BadRequestError("The specified app identifier is invalid.");
  }

  // TODO: Update filters
  const app = await AppModel.findOneAndUpdate(
    {
      _id: appId,
      status: { $ne: "deleted" },
    },
    {
      status: "private",
    },
    {
      new: true,
      lean: true,
    }
  );

  if (!app) {
    throw new NotFoundError(
      "An app with the specified identifier does not exist."
    );
  }

  return toExternal(app);
};

export { create, list, listByIds, getById, update, publish, unpublish };
