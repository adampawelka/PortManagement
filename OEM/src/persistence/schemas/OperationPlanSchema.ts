import mongoose from "mongoose";

const OperationPlanSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
      required: true
    },
    vvnId: {
      type: String,
      required: true,
      index: true
    },
    createdAt: {
      type: Date,
      required: true,
      index: true
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

// Compound indexes for common query patterns
// Index for date range queries on createdAt
OperationPlanSchema.index({ createdAt: 1 });

// Compound index for queries combining vvnId and createdAt (e.g., "all plans for VVN X created in date range")
OperationPlanSchema.index({ vvnId: 1, createdAt: 1 });

// Index for schedule start dates (for querying by operation date)
// Note: This creates an index on the array, allowing queries on schedule.start
OperationPlanSchema.index({ "schedule.start": 1 });

// Compound index for vessel name searches within schedule
// This allows efficient queries like "find plans with vessel X scheduled between dates"
OperationPlanSchema.index({ "schedule.vesselName": 1, "schedule.start": 1 });

export default mongoose.model("OperationPlan", OperationPlanSchema);
