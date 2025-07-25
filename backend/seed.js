const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Task = require("./models/Task");
const JournalEntry = require("./models/JournalEntry");
const CalendarEvent = require("./models/CalendarEvent");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    await JournalEntry.deleteMany({});
    await CalendarEvent.deleteMany({});
    console.log("Existing data cleared");

    // Create dummy users
    const users = [
      {
        username: "john_doe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
      },
      {
        username: "jane_smith",
        email: "jane@example.com",
        password: await bcrypt.hash("password123", 10),
      },
    ];

    const savedUsers = await User.insertMany(users);
    console.log("Users seeded");

    // Create dummy tasks
    const tasks = [
      {
        userId: savedUsers[0]._id,
        title: "Design new landing page",
        description: "Create a responsive landing page for the website",
        dueDate: new Date("2025-08-01"),
        status: "To Do",
        priority: "High",
        category: "Work",
      },
      {
        userId: savedUsers[0]._id,
        title: "Grocery shopping",
        description: "Buy groceries for the week",
        dueDate: new Date("2025-07-26"),
        status: "In Progress",
        priority: "Medium",
        category: "Personal",
      },
      {
        userId: savedUsers[1]._id,
        title: "Prepare presentation",
        description: "Create slides for client meeting",
        dueDate: new Date("2025-07-30"),
        status: "To Do",
        priority: "High",
        category: "Work",
      },
    ];

    await Task.insertMany(tasks);
    console.log("Tasks seeded");

    // Create dummy journal entries
    const journalEntries = [
      {
        userId: savedUsers[0]._id,
        title: "Morning Reflection",
        content: "Feeling motivated to start the day with focus.",
        date: new Date("2025-07-24"),
      },
      {
        userId: savedUsers[0]._id,
        title: "Evening Thoughts",
        content: "Reflected on today's progress and planned for tomorrow.",
        date: new Date("2025-07-24"),
      },
      {
        userId: savedUsers[1]._id,
        title: "Project Ideas",
        content: "Brainstormed ideas for the new app feature.",
        date: new Date("2025-07-23"),
      },
    ];

    await JournalEntry.insertMany(journalEntries);
    console.log("Journal entries seeded");

    // Create dummy calendar events
    const calendarEvents = [
      {
        userId: savedUsers[0]._id,
        title: "Team Meeting",
        date: new Date("2025-07-25"),
        time: "10:00",
      },
      {
        userId: savedUsers[0]._id,
        title: "Doctor Appointment",
        date: new Date("2025-07-27"),
        time: "14:00",
      },
      {
        userId: savedUsers[1]._id,
        title: "Client Call",
        date: new Date("2025-07-26"),
        time: "15:30",
      },
    ];

    await CalendarEvent.insertMany(calendarEvents);
    console.log("Calendar events seeded");

    console.log("Database seeding completed");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
