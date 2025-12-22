import mongoose from "mongoose";

const PlannedOperationSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
      index: true
    },

    operationPlanId: {
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

    plannedStart: {
      type: Date,
      required: true
    },

    plannedEnd: {
      type: Date,
      required: true
    },

    operationType: {
      type: String,
      required: true
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

export default mongoose.model("PlannedOperation", PlannedOperationSchema);
