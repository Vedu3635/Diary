const { RRule } = require("rrule");
const Task = require("../models/Task");
const JournalEntry = require("../models/JournalEntry");
// import { DateTime } from "luxon";
const { DateTime } = require("luxon");

// Fetch calendar events (tasks and journal entries) for a date range
exports.getCalendarEvents = async (req, res) => {
  const { start, end } = req.query;
  const userId = req.user.userId; // From authMiddleware

  // Validate query parameters
  if (!start || !end) {
    return res
      .status(400)
      .json({ message: "Start and end dates are required" });
  }

  try {
    // ✅ Parse ISO strings as UTC
    const startDate = DateTime.fromISO(start, { zone: "utc" });
    const endDate = DateTime.fromISO(end, { zone: "utc" });

    if (!startDate.isValid || !endDate.isValid) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    if (startDate > endDate) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date" });
    }

    // Fetch tasks (non-recurring and recurring)
    const tasks = await Task.find({
      userId,
      $or: [
        { dueDate: { $gte: startDate.toJSDate(), $lte: endDate.toJSDate() } },
        {
          recurrenceRule: { $ne: null },
          dueDate: { $lte: endDate.toJSDate() },
        },
      ],
    }).lean();

    // console.log("getCalendarEvents: Tasks fetched", {
    //   taskCount: tasks.length,
    // });

    // Process tasks into events
    const taskEvents = [];

    for (const task of tasks) {
      if (task.recurrenceRule && task.dueDate) {
        try {
          const rule = RRule.fromString(
            `DTSTART:${DateTime.fromJSDate(task.dueDate)
              .toUTC()
              .toFormat("yyyyMMdd'T'HHmmss'Z'")}\n${task.recurrenceRule}`
          );

          const dates = rule.between(
            startDate.toJSDate(),
            endDate.toJSDate(),
            true
          );
          dates.forEach((date) => {
            const dt = DateTime.fromJSDate(date).toUTC();
            taskEvents.push({
              id: `${task._id}-${dt.toISO().replace(/[:.]/g, "-")}`,
              userId,
              title: task.title,
              start: dt.toISO(),
              end: dt.plus({ minutes: 30 }).toISO(),
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
        const dt = DateTime.fromJSDate(task.dueDate).toUTC();
        taskEvents.push({
          id: task._id.toString(),
          userId,
          title: task.title,
          start: dt.toISO(),
          end: dt.plus({ minutes: 30 }).toISO(),
          type: "task",
          status: task.status,
          completed: task.status === "Completed",
          priority: task.priority || "Medium",
          category: task.category || "Personal",
          content: task.description || "",
        });
      }
    }

    // Fetch journal entries
    const journalEntries = await JournalEntry.find({
      userId,
      date: { $gte: startDate.toJSDate(), $lte: endDate.toJSDate() },
    }).lean();

    // console.log("getCalendarEvents: Journal entries fetched", {
    //   journalCount: journalEntries.length,
    // });

    // Process journal entries into events
    const journalEvents = journalEntries.map((entry) => {
      const dt = DateTime.fromJSDate(entry.date).toUTC();
      return {
        id: entry._id.toString(),
        userId,
        title: entry.title,
        start: dt.toISO(),
        end: dt.toISO(),
        type: "journal",
        content: entry.content || "",
        mood: entry.mood || "neutral",
        completed: false,
      };
    });

    // Combine and sort events by start date
    const events = [...taskEvents, ...journalEvents].sort(
      (a, b) => DateTime.fromISO(a.start) - DateTime.fromISO(b.start)
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
