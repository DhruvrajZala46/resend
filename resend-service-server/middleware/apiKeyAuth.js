import ApiKey from "../models/ApiKey.js";

const publicTypes = [
  "register",
  "forgot-password",
  "resend-verification",
  "app-credentials-created",
  "app-credentials-deleted",
];

export const apiKeyAuth = async (req, res, next) => {
  try {
    const { type } = req.body;

    if (type && publicTypes.includes(type)) {
      req.fromEmail = process.env.SMTP_RELAY_USER;
      req.apiUser = null;
      req.apiKey = null;
      return next();
    }

    // Otherwise, require valid API key
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) return res.status(401).json({ error: "API key missing" });

    const key = await ApiKey.findOne({ key: apiKey, active: true }).populate(
      "user"
    );

    if (!key)
      return res.status(403).json({ error: "Invalid or inactive API key" });

    req.apiUser = key.user;
    req.apiKey = key;
    req.fromEmail = key.user.email;
    req.fromUserId = key.user._id;

    next();
  } catch (err) {
    console.error("API Key Auth Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
