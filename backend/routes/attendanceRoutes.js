const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { markAttendance, getAttendance } = require("../controllers/attendanceController");

const router = express.Router();

// Lead marks attendance
router.post("/", protect, authorize("lead"), markAttendance);

// View attendance by event (Lead + Faculty can view)
router.get("/:eventId", protect, authorize("lead", "faculty"), getAttendance);

module.exports = router;
