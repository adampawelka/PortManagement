import mongoose from "mongoose";

const IncidentTypeSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true
    },

    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      required: true,
      enum: {
        values: ["Minor", "Major", "Critical"],
        message: '{VALUE} is not a valid severity'
      }
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncidentType",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("IncidentType", IncidentTypeSchema);
