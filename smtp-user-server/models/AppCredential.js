import mongoose from "mongoose";

const appCredentialSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      required: true,
      trim: true,
    },
    appPassword: {
      type: String,
      required: true,
      select: false,
    },
    appUserEmail: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

appCredentialSchema.index({ createdBy: 1 }, { unique: true });

const AppCredential = mongoose.model("AppCredential", appCredentialSchema);

export default AppCredential;
