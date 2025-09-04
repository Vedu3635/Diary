const connectDB = require("./config/db");
const Task = require("./models/Task");
require("dotenv").config();

const seed = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear only tasks (keep users/journal/events intact)
    // await Task.deleteMany({});/
    console.log("🗑️ Existing tasks cleared");

    // Dummy tasks (you can expand this)
    const tasks = [
      // --- User 1: 68833bf6dd799be897dda88b ---
      {
        userId: "68833bf6dd799be897dda88b",
        title: "Prepare resume",
        description: "Update projects and add certifications",
        dueDate: "2025-08-10T00:00:00.000Z",
        status: "To Do",
        priority: "High",
        category: "Career",
      },
      {
        userId: "68833bf6dd799be897dda88b",
        title: "Buy groceries",
        description: "Milk, eggs, bread, and vegetables",
        dueDate: "2025-08-01T00:00:00.000Z",
        status: "Completed",
        priority: "Low",
        category: "Personal",
      },
      {
        userId: "68833bf6dd799be897dda88b",
        title: "Team meeting",
        description: "Weekly sync-up with team members",
        dueDate: "2025-09-02T10:00:00.000Z",
        status: "To Do",
        priority: "Medium",
        category: "Work",
      },
      {
        userId: "68833bf6dd799be897dda88b",
        title: "Doctor appointment",
        description: "Routine check-up with Dr. Patel",
        dueDate: "2025-09-05T15:00:00.000Z",
        status: "To Do",
        priority: "High",
        category: "Health",
      },
      {
        userId: "68833bf6dd799be897dda88b",
        title: "Pay electricity bill",
        description: "Clear dues before deadline",
        dueDate: "2025-08-25T00:00:00.000Z",
        status: "In Progress",
        priority: "Medium",
        category: "Finance",
      },
      {
        userId: "68833bf6dd799be897dda88b",
        title: "Finish online course",
        description: "Complete ReactJS course on Udemy",
        dueDate: "2025-09-12T00:00:00.000Z",
        status: "To Do",
        priority: "High",
        category: "Learning",
      },
      {
        userId: "68833bf6dd799be897dda88b",
        title: "Organize workspace",
        description: "Clean desk and sort documents",
        dueDate: "2025-08-28T00:00:00.000Z",
        status: "Completed",
        priority: "Low",
        category: "Personal",
      },

      // --- User 2: 68833f1205e123c71c693700 ---
      {
        userId: "68833f1205e123c71c693700",
        title: "Finish reading book",
        description: "Complete the last 3 chapters of 'Atomic Habits'",
        dueDate: "2025-08-05T00:00:00.000Z",
        status: "To Do",
        priority: "Low",
        category: "Hobby",
      },
      {
        userId: "68833f1205e123c71c693700",
        title: "Workout session",
        description: "1-hour strength training at the gym",
        dueDate: "2025-09-01T07:00:00.000Z",
        status: "To Do",
        priority: "High",
        category: "Health",
      },
      {
        userId: "68833f1205e123c71c693700",
        title: "Submit project report",
        description: "Finalize and email project report to manager",
        dueDate: "2025-08-20T00:00:00.000Z",
        status: "In Progress",
        priority: "High",
        category: "Work",
      },
      {
        userId: "68833f1205e123c71c693700",
        title: "Buy birthday gift",
        description: "Get a gift for Alex’s birthday",
        dueDate: "2025-09-04T00:00:00.000Z",
        status: "To Do",
        priority: "Medium",
        category: "Personal",
      },
      {
        userId: "68833f1205e123c71c693700",
        title: "Laundry",
        description: "Wash and fold clothes",
        dueDate: "2025-08-22T00:00:00.000Z",
        status: "Completed",
        priority: "Low",
        category: "Chores",
      },
      {
        userId: "68833f1205e123c71c693700",
        title: "Coding practice",
        description: "Solve 3 LeetCode problems",
        dueDate: "2025-09-01T21:00:00.000Z",
        status: "To Do",
        priority: "High",
        category: "Learning",
      },
      {
        userId: "68833f1205e123c71c693700",
        title: "Weekend trip planning",
        description: "Decide location and book hotel",
        dueDate: "2025-09-10T00:00:00.000Z",
        status: "To Do",
        priority: "Medium",
        category: "Leisure",
      },

      // --- User 3: 68838a9e950d993e1b328592 ---
      {
        userId: "68838a9e950d993e1b328592",
        title: "Call parents",
        description: "Weekly catch-up call",
        dueDate: "2025-08-03T00:00:00.000Z",
        status: "Completed",
        priority: "Low",
        category: "Personal",
      },
      {
        userId: "68838a9e950d993e1b328592",
        title: "Client presentation",
        description: "Prepare slides for Monday presentation",
        dueDate: "2025-09-03T09:30:00.000Z",
        status: "To Do",
        priority: "High",
        category: "Work",
      },
      {
        userId: "68838a9e950d993e1b328592",
        title: "Plan weekend trip",
        description: "Research destinations and book tickets",
        dueDate: "2025-08-15T00:00:00.000Z",
        status: "To Do",
        priority: "Medium",
        category: "Leisure",
      },
      {
        userId: "68838a9e950d993e1b328592",
        title: "Pay credit card bill",
        description: "Clear dues before penalty",
        dueDate: "2025-09-08T00:00:00.000Z",
        status: "To Do",
        priority: "High",
        category: "Finance",
      },
      {
        userId: "68838a9e950d993e1b328592",
        title: "Attend yoga class",
        description: "Evening relaxation yoga",
        dueDate: "2025-08-29T18:00:00.000Z",
        status: "In Progress",
        priority: "Medium",
        category: "Health",
      },
      {
        userId: "68838a9e950d993e1b328592",
        title: "Shopping for festival",
        description: "Buy clothes and sweets",
        dueDate: "2025-09-12T00:00:00.000Z",
        status: "To Do",
        priority: "Medium",
        category: "Personal",
      },
      {
        userId: "68838a9e950d993e1b328592",
        title: "Write blog post",
        description: "Draft article on productivity hacks",
        dueDate: "2025-08-18T00:00:00.000Z",
        status: "To Do",
        priority: "Low",
        category: "Hobby",
      },
    ];

    await Task.insertMany(tasks);
    console.log("✅ Tasks seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding tasks:", error);
    process.exit(1);
  }
};

seed();
