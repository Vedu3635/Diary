// backend/controllers/journalController.js
const JournalEntry = require("../models/JournalEntry");

exports.getJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createJournalEntry = async (req, res) => {
  const { title, content, date } = req.body;
  try {
    const entry = new JournalEntry({
      userId: req.user,
      title,
      content,
      date,
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateJournalEntry = async (req, res) => {
  const { title, content, date } = req.body;
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { title, content, date },
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
      userId: req.user,
    });
    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }
    res.json({ message: "Journal entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
