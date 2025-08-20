const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendarController");
const authMiddleware = require("../middleware/auth");

router.get("/events", authMiddleware, calendarController.getCalendarEvents);
// Disable direct CRUD for calendar events
// router.post("/", authMiddleware, (req, res) => {
//   res
//     .status(400)
//     .json({ message: "Use /api/tasks or /api/journal to create events" });
// });
// router.put("/:id", authMiddleware, (req, res) => {
//   res.status(400).json({
//     message: "Use /api/tasks/:id or /api/journal/:id to update events",
//   });
// });
// router.delete("/:id", authMiddleware, (req, res) => {
//   res.status(400).json({
//     message: "Use /api/tasks/:id or /api/journal/:id to delete events",
//   });
// });

module.exports = router;
