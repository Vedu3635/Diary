// backend/models/CalendarEvent.js
const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
