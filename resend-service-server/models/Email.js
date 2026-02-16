import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    subject: { type: String },
    text: { type: String },
    html: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed },
    isSystem: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "sending", "sent", "failed"],
      default: "pending",
      index: true,
    },
    attempts: { type: Number, default: 0 },
    lastError: { type: String, default: "" },
    nextAttemptAt: { type: Date, default: new Date(0), index: true },
    processingBy: { type: String, default: null, index: true },
    claimedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, strict: true },
);

EmailSchema.index({ status: 1, nextAttemptAt: 1, createdAt: 1 });

export default mongoose.models.Email || mongoose.model("Email", EmailSchema);
