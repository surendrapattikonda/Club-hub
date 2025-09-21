const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { createUser } = require("../controllers/adminController");

const router = express.Router();

// Only admin can create faculty or HOD
router.post("/create-user", protect, authorize("admin"), createUser);

module.exports = router;
