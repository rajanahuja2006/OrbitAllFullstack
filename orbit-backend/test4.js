import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./src/routes/resumeRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
console.log("ALL LOADED OKAY!");
process.exit(0);
