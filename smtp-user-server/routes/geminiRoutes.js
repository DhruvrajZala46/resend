import express from "express";
import { modifyEmailTemplateByAI } from "../controllers/geminiController.js";

const geminiRouter = express.Router();

geminiRouter.post("/modify-email-template-by-ai", modifyEmailTemplateByAI);

export default geminiRouter;
