import mongoose from "mongoose";

const IncidentTypeSchema = new mongoose.Schema(
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
    },

    severity: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("IncidentType", IncidentTypeSchema);
