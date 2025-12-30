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

          cranes: { type: [String], default: [] },
          staff: { type: [String], default: [] }
        }
      ],
      default: []
    }
  },
  {
    timestamps: false
  }
);

// =======================
// Indexes
// =======================

// date range queries
OperationPlanSchema.index({ createdAt: 1 });

// vvn + date
OperationPlanSchema.index({ vvnId: 1, createdAt: 1 });

// operation date queries
OperationPlanSchema.index({ "schedule.start": 1 });

// vessel schedule search
OperationPlanSchema.index({ "schedule.vesselName": 1, "schedule.start": 1 });

export default mongoose.model("OperationPlan", OperationPlanSchema);
