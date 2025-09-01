export const staticTasks = [
  {
    id: 1,
    name: "Finish Report",
    category: "Work",
    priority: "High",
    dueDate: "2025-07-20",
    status: "pending",
    notes: "Complete by EOD",
  },
  {
    id: 2,
    name: "Grocery Shopping",
    category: "Personal",
    priority: "Low",
    dueDate: "2025-07-21",
    status: "completed",
    notes: "Buy milk",
  },
  {
    id: 3,
    name: "Call Client",
    category: "Work",
    priority: "Medium",
    dueDate: "2025-07-19",
    status: "completed",
    notes: "Discuss project",
  },
];

export const staticJournalEntries = [
  {
    id: 1,
    content: "Felt accomplished after finishing report",
    date: "2025-07-20",
    mood: "Happy",
    tags: ["#work", "#success"],
    category: "Work",
    linkedTasks: [1],
    userId: "123e4567-e89b-12d3-a456-426614174000",
    media: [{ type: "image", url: "/assets/report.jpg" }],
  },
  {
    id: 2,
    content: "Stressed about client call",
    date: "2025-07-19",
    mood: "Stressed",
    tags: ["#work", "#stress"],
    category: "Work",
    linkedTasks: [3],
    userId: "123e4567-e89b-12d3-a456-426614174000",
    media: [],
  },
];

export const staticGoals = [
  {
    id: 1,
    name: "Journal daily",
    target: "7 days",
    progress: 5,
    type: "journal",
  },
  {
    id: 2,
    name: "Complete 5 tasks weekly",
    target: 5,
    progress: 3,
    type: "task",
  },
];
