const CalendarEvent = require("../models/CalendarEvent");

exports.getCalendarEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find({ userId: req.user });
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createCalendarEvent = async (req, res) => {
  const { title, date, content, type, priority, completed } = req.body;
  try {
    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }
    const event = new CalendarEvent({
      userId: req.user.userId,
      title,
      date,
      content: content || "",
      type: type || "journal",
      priority: type === "task" ? priority || "medium" : null,
      completed: type === "task" ? completed || false : false,
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCalendarEvent = async (req, res) => {
  const { title, date, content, type, priority, completed } = req.body;
  try {
    const event = await CalendarEvent.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!event) {
      return res.status(404).json({ message: "Calendar event not found" });
    }
    event.title = title || event.title;
    event.date = date || event.date;
    event.content = content !== undefined ? content : event.content;
    event.type = type || event.type;
    event.priority = type === "task" ? priority || event.priority : null;
    event.completed = type === "task" ? completed || event.completed : false;
    await event.save();
    res.status(200).json(event);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCalendarEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!event) {
      return res.status(404).json({ message: "Calendar event not found" });
    }
    res.status(200).json({ message: "Calendar event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Server error" });
  }
};
