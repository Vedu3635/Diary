// backend/controllers/calendarController.js
const CalendarEvent = require("../models/CalendarEvent");

exports.getCalendarEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find({ userId: req.user });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createCalendarEvent = async (req, res) => {
  const { title, date, time } = req.body;
  try {
    const event = new CalendarEvent({
      userId: req.user,
      title,
      date,
      time,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCalendarEvent = async (req, res) => {
  const { title, date, time } = req.body;
  try {
    const event = await CalendarEvent.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { title, date, time },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: "Calendar event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCalendarEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });
    if (!event) {
      return res.status(404).json({ message: "Calendar event not found" });
    }
    res.json({ message: "Calendar event deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
