import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { App } from "../types";
import { appStatuses } from "../utils/constants";

const appSchema = new Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 128,
    required: true,
  },
  description: {
    type: String,
    minlength: 0,
    maxlength: 512,
    default: "",
  },
  groups: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    required: true,
  },
  resources: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resource",
      },
    ],
    default: [],
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: appStatuses,
    default: "private",
  },
}, { timestamps: true });

appSchema.plugin(paginate);

export default model<App>("App", appSchema);
