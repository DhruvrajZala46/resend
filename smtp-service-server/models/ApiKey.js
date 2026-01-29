import mongoose from "mongoose";
import crypto from "crypto";

const apiKeySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    key: { type: String, required: true, unique: true },
    name: { type: String },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Generate a random API key
apiKeySchema.statics.generateKey = function () {
  return crypto.randomBytes(32).toString("hex");
};

export default mongoose.model("ApiKey", apiKeySchema);
