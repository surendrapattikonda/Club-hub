// routes/adminRoutes.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { createUser, deleteUser ,getFaculty} = require("../controllers/adminController");

const router = express.Router();

// ✅ Only admin can create Faculty or HOD
router.post("/create-user", protect, authorize("admin"), createUser);

// ✅ Only admin can delete Faculty or HOD
router.delete("/delete-user/:id", protect, authorize("admin"), deleteUser);
router.get("/faculty", protect, authorize("admin"), getFaculty);

module.exports = router;
