import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    key: { type: String, required: true, unique: true },
    name: { type: String },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

apiKeySchema.statics.generateKey = function () {
  const prefix = "lite";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let randomPart = "";
  for (let i = 0; i < 35; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + randomPart;
};

export default mongoose.model("ApiKey", apiKeySchema);
