const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Hello from MongoDB + Node.js!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
