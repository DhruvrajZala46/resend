import express from "express";
import {
  registerUser,
  verifyUser,
  loginUser,
  getUserDetails,
  logoutUser,
  createApiKey,
  deleteApiKey,
  listApiKeys,
  toggleApiKeyStatus,
  createAppCredentials,
  listAppCredentials,
  deleteAppCredentials,
  viewDecryptedAppCredential,
  getUserDashboard,
  getPublicEmailTemplates,
  getMyEmailTemplates,
  createEmailTemplate,
  getEmailTemplateByTemplateId,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/email-templates/public", getPublicEmailTemplates);
router.post("/get-variables", getEmailTemplateByTemplateId);

// protected route
router.use(protect);

router.get("/me", getUserDetails);

// api key routes
router.post("/create-api-key", createApiKey);
router.get("/api-keys", listApiKeys);
router.delete("/:id", deleteApiKey);
router.patch("/:id/toggle", protect, toggleApiKeyStatus);

// app pass and user for SMTP
router.post("/app/create-credentials", createAppCredentials);
router.get("/app/credentials", listAppCredentials);
router.get("/app/credentials/:id/decrypted", viewDecryptedAppCredential);
router.delete("/app/:id", deleteAppCredentials);

// email template routes
router.get("/email-templates/my", getMyEmailTemplates);
router.post("/create-email-template", protect, createEmailTemplate);

export default router;
