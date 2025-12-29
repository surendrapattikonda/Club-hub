const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
  createClub,
  getClubs,
  getClubById,
  deleteClub,
  joinClub,
  approveMember,
  assignLead,
  removeLead,
  getMyClubs,
  getAllClubDetails,
  getUserByEmail,
} = require("../controllers/clubController");

const router = express.Router();

/**
 * 📌 Routes & Permissions
 *
 * Faculty/HOD → create, update, delete, assign/remove leads
 * Student     → request to join
 * Lead        → approve members
 */

// ================= Faculty / HOD ==================
router.post("/", protect, authorize("faculty", "hod"), createClub);
router.delete("/:id", protect, authorize("faculty", "hod"), deleteClub);
router.put("/:id/assign-lead/:userId", protect, authorize("faculty", "hod"), assignLead);
router.put("/:id/remove-lead/:userId", protect, authorize("faculty", "hod"), removeLead);
// ================= Faculty / HOD ==================
router.get(
  "/all/details",
  protect,
  authorize("faculty", "hod"),
  getAllClubDetails
);
// Add this route to your clubRoutes.js
router.get('/user/email/:email', protect, getUserByEmail);


// ================= Leads ==================
router.put("/:id/approve/:userId", protect, authorize("lead"), approveMember);


// ================= Students ==================
router.post("/:id/join", protect, authorize("student"), joinClub);

// ================= Current User ==================
router.get("/my", protect, getMyClubs); // ✅ Fetch only logged-in user’s clubs

// ================= Public ==================
router.get("/", getClubs);
router.get("/:id", getClubById);

module.exports = router;
