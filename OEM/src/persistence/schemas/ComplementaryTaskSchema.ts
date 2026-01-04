import mongoose from "mongoose";

const ComplementaryTaskSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
      index: true
    },

    vesselVisitExecutionId: {
      type: String,
      required: true,
      index: true
    },

    categoryId: {
      type: String,
      required: true,
      index: true
    },

    responsibleTeam: {
      type: String,
      required: true
    },

    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      required: false
    },

    status: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "ComplementaryTask",
  ComplementaryTaskSchema
);
