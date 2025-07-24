// backend/routes/calendar.js
const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendarController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, calendarController.getCalendarEvents);
router.post("/", authMiddleware, calendarController.createCalendarEvent);
router.put("/:id", authMiddleware, calendarController.updateCalendarEvent);
router.delete("/:id", authMiddleware, calendarController.deleteCalendarEvent);

module.exports = router;
