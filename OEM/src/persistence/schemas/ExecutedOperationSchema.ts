import mongoose from "mongoose";

const ExecutedOperationSchema = new mongoose.Schema(
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

    plannedOperationId: {
      type: String,
      required: true,
      index: true
    },

    resourceId: {
      type: String,
      required: true
    },

    staffId: {
      type: String,
      required: true
    },

    actualStart: {
      type: Date,
      required: true
    },

    actualEnd: {
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
  "ExecutedOperation",
  ExecutedOperationSchema
);
