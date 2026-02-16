import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import emailRoutes from "./routes/emailRoutes.js";
import { getWorker } from "./workers/worker.js";
import "./models/User.js";
import { info } from "./utils/logger.js";
import cookieParser from "cookie-parser";
import emailEventsRoutes from "./routes/emailEventsRoutes.js";

dotenv.config();
const app = express();

// Allow all origins for CORS
app.use(
  cors({
    origin: "*", // allow all domains
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "x-api-key", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || "/api";

// API routes
app.use(`${API_PREFIX}/email`, emailRoutes);
app.use(`${API_PREFIX}/email`, emailEventsRoutes);

(async function bootstrap() {
  await connectDB(process.env.MONGO_URI);

  // start worker
  getWorker();

  app.listen(PORT, () => {
    info(`🚀 API server listening on port ${PORT}`);
    info(`📨 Email API available at ${API_PREFIX}/email/send`);
  });
})();
