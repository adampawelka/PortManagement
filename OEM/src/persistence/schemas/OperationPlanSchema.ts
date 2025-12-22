import mongoose from "mongoose";

const OperationPlanSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
      required: true
    },

    vveId: {
      type: String,
      required: true
    },

    createdAt: {
      type: Date,
      required: true
    },

    createdBy: {
      type: String,
      required: true
    },

    algorithmUsed: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("OperationPlan", OperationPlanSchema);
