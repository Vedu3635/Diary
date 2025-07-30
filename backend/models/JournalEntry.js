const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, default: "Untitled Entry" },
  content: { type: String, required: true },
  mood: {
    type: String,
    default: "neutral",
    enum: ["happy", "neutral", "sad", "excited"],
  },
  tags: { type: [String], default: [] },
  date: { type: Date, default: Date.now }, // User-specified entry date
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update `updatedAt` on save
journalEntrySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("JournalEntry", journalEntrySchema);
