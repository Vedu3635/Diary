const { RRule } = require("rrule");
const Task = require("../models/Task");
const JournalEntry = require("../models/JournalEntry");

// Fetch calendar events (tasks and journal entries) for a date range
exports.getCalendarEvents = async (req, res) => {
  const { start, end, page = 1, limit = 100 } = req.query;
  const userId = req.user.userId; // From authMiddleware
  // console.log("getCalendarEvents: Request received", {
  //   userId,
  //   start,
  //   end,
  //   page,
  //   limit,
  // });

  // Validate query parameters
  if (!start || !end) {
    // console.log("getCalendarEvents: Missing start or end date");
    return res
      .status(400)
      .json({ message: "Start and end dates are required" });
  }
  if (isNaN(page) || page < 1) {
    // console.log("getCalendarEvents: Invalid page number", { page });
    return res.status(400).json({ message: "Invalid page number" });
  }
  if (isNaN(limit) || limit < 1 || limit > 1000) {
    // console.log("getCalendarEvents: Invalid limit", { limit });
    return res.status(400).json({ message: "Invalid limit (1-1000)" });
  }

  const skip = (page - 1) * limit;
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Validate dates
  if (isNaN(startDate) || isNaN(endDate)) {
    // console.log("getCalendarEvents: Invalid date format", { start, end });
    return res.status(400).json({ message: "Invalid date format" });
  }
  if (startDate > endDate) {
    // console.log("getCalendarEvents: Start date after end date", {
    //   startDate,
    //   endDate,
    // });
    return res
      .status(400)
      .json({ message: "Start date must be before end date" });
  }

  try {
    // Fetch tasks (non-recurring and recurring)
    const tasks = await Task.find({
      userId,
      $or: [
        // Non-recurring tasks in date range
        { dueDate: { $gte: startDate, $lte: endDate } },
        // Recurring tasks that might generate events in date range
        {
          recurrenceRule: { $ne: null },
          dueDate: { $lte: endDate }, // Optimization: exclude tasks starting after end date
        },
      ],
    })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // console.log("getCalendarEvents: Tasks fetched", {
    //   taskCount: tasks.length,
    // });

    // Process tasks into events
    const taskEvents = [];
    tasks.forEach((task) => {
      if (task.recurrenceRule && task.dueDate) {
        try {
          // Parse RRule string
          const rule = RRule.fromString(
            `DTSTART:${
              new Date(task.dueDate)
                .toISOString()
                .replace(/[-:]/g, "")
                .split(".")[0]
            }Z\n${task.recurrenceRule}`
          );
          // Get occurrences in date range
          const dates = rule.between(startDate, endDate, true);
          dates.forEach((date) => {
            taskEvents.push({
              id: `${task._id}-${date.toISOString().replace(/[:.]/g, "-")}`,
              userId: req.user.userId,
              title: task.title,
              start: date.toISOString(),
              end: new Date(date.getTime() + 30 * 60 * 1000).toISOString(),
              type: "task",
              status: task.status,
              completed: task.status === "Completed",
              priority: task.priority || "Medium",
              category: task.category || "Personal",
              content: task.description || "",
            });
          });
        } catch (err) {
          console.error(
            `getCalendarEvents: Invalid RRule for task ${task._id}:`,
            err.message
          );
        }
      } else if (task.dueDate) {
        // Non-recurring task
        taskEvents.push({
          id: task._id.toString(),
          userId: req.user.userId,
          title: task.title,
          start: new Date(task.dueDate).toISOString(),
          end: new Date(
            new Date(task.dueDate).getTime() + 30 * 60 * 1000
          ).toISOString(),
          type: "task",
          status: task.status,
          completed: task.status === "Completed",
          priority: task.priority || "Medium",
          category: task.category || "Personal",
          content: task.description || "",
        });
      }
    });

    // Fetch journal entries
    const journalEntries = await JournalEntry.find({
      userId: req.user.userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // console.log("getCalendarEvents: Journal entries fetched", {
    //   journalCount: journalEntries.length,
    // });

    // Process journal entries into events
    const journalEvents = journalEntries.map((entry) => ({
      id: entry._id.toString(),
      userId: req.user.userId,
      title: entry.title,
      start: new Date(entry.date).toISOString(),
      end: new Date(entry.date).toISOString(),
      type: "journal",
      content: entry.content || "",
      mood: entry.mood || "neutral",
      completed: false,
    }));

    // Combine and sort events by start date
    const events = [...taskEvents, ...journalEvents].sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );

    // console.log("getCalendarEvents: Sending response", {
    //   eventCount: events.length,
    // });
    res.status(200).json(events);
  } catch (err) {
    console.error(
      "getCalendarEvents: Error fetching calendar events:",
      err.message
    );
    res.status(500).json({ message: "Server error" });
  }
};

// Redirect CRUD operations to appropriate endpoints
exports.createCalendarEvent = async (req, res) => {
  // console.log("createCalendarEvent: Redirecting to /api/tasks or /api/journal");
  res.status(400).json({
    message: "Please use /api/tasks or /api/journal to create events",
  });
};

exports.updateCalendarEvent = async (req, res) => {
  // console.log(
  //   "updateCalendarEvent: Redirecting to /api/tasks/:id or /api/journal/:id"
  // );
  res.status(400).json({
    message: "Please use /api/tasks/:id or /api/journal/:id to update events",
  });
};

exports.deleteCalendarEvent = async (req, res) => {
  s;
  res.status(400).json({
    message: "Please use /api/tasks/:id or /api/journal/:id to delete events",
  });
};
