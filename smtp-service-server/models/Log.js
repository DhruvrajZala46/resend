import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  level: { type: String, enum: ["info", "error"], default: "info" },
  message: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

export default mongoose.model("Log", logSchema);
