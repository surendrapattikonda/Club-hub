const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { addActivity, viewMembers, getStudentActivities } = require("../controllers/activityController");

const router = express.Router();

// Lead routes
router.post("/", protect, authorize("lead"), addActivity);
router.get("/members", protect, authorize("lead"), viewMembers);

// Student routes
router.get("/my-activities", protect, authorize("student"), getStudentActivities);

module.exports = router;
