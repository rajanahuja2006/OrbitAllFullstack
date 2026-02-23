import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resumeRoutes.js";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.get("/", (req, res) => {
  res.send("Orbit Backend Running 🚀");
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);