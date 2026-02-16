// models/Email.js
import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true }, // comma-separated or single
  subject: { type: String, default: "" },
  text: { type: String, default: "" },
  html: { type: String, default: "" },

  // internal delivery data
  status: {
    type: String,
    enum: ["pending", "sending", "sent", "failed"],
    default: "pending",
  },
  attempts: { type: Number, default: 0 },
  lastError: { type: String, default: "" },
  nextAttemptAt: { type: Date, default: Date.now },
  isSystem: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  meta: { type: Object, default: {} }, // arbitrary metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

emailSchema.index({ status: 1, nextAttemptAt: 1 }); // for efficient polling

emailSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Email", emailSchema);
