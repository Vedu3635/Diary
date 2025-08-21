const JournalEntry = require("../models/JournalEntry");

exports.getJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.userId });
    res.json(entries);
  } catch (error) {
    console.error("❌ Error in getJournalEntries:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createJournalEntry = async (req, res) => {
  const { title, content, mood = "neutral", tags = [] } = req.body;
  try {
    const entry = new JournalEntry({
      userId: req.user.userId,
      title: title || "Untitled Entry",
      content,
      date,
      tags,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateJournalEntry = async (req, res) => {
  const { title, content, mood, tags, date } = req.body;
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, content, mood, tags, date, updatedAt: new Date() },
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteJournalEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }
    res.json({ message: "Journal entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
