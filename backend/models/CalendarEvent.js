const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String, // Store as YYYY-MM-DD
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: "Date must be in YYYY-MM-DD format",
      },
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["journal", "task"],
      default: "journal",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low", null],
      default: null, // Only used for tasks
    },
    completed: {
      type: Boolean,
      default: false, // Only used for tasks
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically updates createdAt and updatedAt
  }
);

// Ensure date is stored in YYYY-MM-DD format before saving
calendarEventSchema.pre("save", function (next) {
  if (this.date) {
    this.date = new Date(this.date).toISOString().split("T")[0];
  }
  next();
});

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
