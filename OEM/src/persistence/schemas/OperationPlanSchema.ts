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
    },
    schedule: {
      type: [
        {
          vesselName: { type: String, required: true },
          start: { type: Date, required: true },
          end: { type: Date, required: true },
          delay: { type: Number, default: 0 },
          dock: { type: String },
          crane: { type: String },
          staff: { type: [String], default: [] }
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("OperationPlan", OperationPlanSchema);
