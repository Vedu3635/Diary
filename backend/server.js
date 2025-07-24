// backend/server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const journalRoutes = require("./routes/journal");
const calendarRoutes = require("./routes/calendar");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/calendar", calendarRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
