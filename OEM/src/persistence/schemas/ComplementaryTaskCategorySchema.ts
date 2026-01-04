import mongoose from "mongoose";

const ComplementaryTaskCategorySchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
      index: true
    },

    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    name: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "ComplementaryTaskCategory",
  ComplementaryTaskCategorySchema
);
