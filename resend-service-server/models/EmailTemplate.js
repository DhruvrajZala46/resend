import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const EmailTemplateSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    templateId: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
      immutable: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    html: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "custom",
      index: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("EmailTemplate", EmailTemplateSchema);
