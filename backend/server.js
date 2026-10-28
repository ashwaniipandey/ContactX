require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Global Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during local dev
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const mongoose = require("mongoose");
  const dbStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.status(200).json({
    status: "online",
    system: "ContactX Full-Stack Backend",
    database: `MongoDB (${dbStatus})`,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/statistics", require("./routes/statsRoutes"));

// Catch-all 404 for unknown API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `API Route ${req.originalUrl} not found`,
  });
});

// Root welcome
app.get("/", (req, res) => {
  res.send("🚀 ContactX Express & MongoDB Backend API is running on port " + PORT);
});

// Error handling middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`\n==============================================`);
  console.log(`🚀 ContactX Backend Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`==============================================\n`);
});
