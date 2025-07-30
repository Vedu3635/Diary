// config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Optional: helpful flags
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Initial MongoDB Connection Error:", error.message);
    process.exit(1); // stop app if unable to connect
  }

  // ✅ General runtime error logging
  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Runtime Error:", err.message);
    console.error(err.stack);
  });

  // ✅ Connection events
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
  });

  mongoose.connection.on("connected", () => {
    console.log("🔌 MongoDB reconnected (runtime)");
  });

  mongoose.connection.on("reconnectFailed", () => {
    console.error("🚫 MongoDB failed to reconnect");
  });

  // Optional: log when reconnecting starts
  mongoose.connection.on("reconnect", () => {
    console.log("🔁 Attempting to reconnect to MongoDB...");
  });
};

module.exports = connectDB;
