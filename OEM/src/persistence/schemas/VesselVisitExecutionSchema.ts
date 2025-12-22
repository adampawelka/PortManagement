import mongoose from "mongoose";

const VesselVisitExecutionSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
      required: true
    },

    vvnId: {
      type: String,
      required: true
    },

    actualArrivalTime: {
      type: Date,
      required: true
    },

    actualBerthTime: {
      type: Date,
      required: false
    },

    dockId: {
      type: String,
      required: false
    },

    status: {
      type: String,
      required: true
    },

    createdBy: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "VesselVisitExecution",
  VesselVisitExecutionSchema
);
