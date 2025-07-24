// backend/routes/journal.js
const express = require("express");
const router = express.Router();
const journalController = require("../controllers/journalController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, journalController.getJournalEntries);
router.post("/", authMiddleware, journalController.createJournalEntry);
router.put("/:id", authMiddleware, journalController.updateJournalEntry);
router.delete("/:id", authMiddleware, journalController.deleteJournalEntry);

module.exports = router;
