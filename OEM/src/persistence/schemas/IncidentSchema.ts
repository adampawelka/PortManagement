import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true,
      index: true
    },

    incidentTypeId: {
      type: String,
      required: true,
      index: true
    },

    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      required: false
    },

    severity: {
      type: String,
      required: true
    },

    description: {
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

export default mongoose.model("Incident", IncidentSchema);
