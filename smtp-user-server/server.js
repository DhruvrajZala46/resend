import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import geminiRouter from "./routes/geminiRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "x-api-key", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api/users", userRouter);
app.use("/api/gemini", geminiRouter);

// start server
(async function bootstrap() {
  await connectDB(process.env.MONGO_URI);

  app.listen(PORT, () => {
    console.log(`🚀 API server listening on port ${PORT}`);
  });
})();
