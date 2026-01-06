const Club = require("../models/Club");
const User = require("../models/User");
const generateToken = require("./authController");
// @desc Create a new club
// @route POST /api/clubs
// @access Admin (or Superuser)
createClub = async (req, res) => {
  try {
    const { name, description } = req.body;

    const clubExists = await Club.findOne({ name });
    if (clubExists) {
      return res.status(400).json({ message: "Club already exists" });
    }

    const club = new Club({ name, description });
    await club.save();

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all clubs
// @route GET /api/clubs
// @access Public
getClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("leads", "name email")
      .populate("members", "name email");

    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single club by ID
// @route GET /api/clubs/:id
// @access Public
getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("leads", "name email")
      .populate("members", "name email")
      .populate("pendingMembers", "name email");

    if (!club) return res.status(404).json({ message: "Club not found" });

    res.json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Request to join a club
// @route POST /api/clubs/:id/join
// @access Student
joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    if (
      club.members.includes(req.user._id) ||
      club.pendingMembers.includes(req.user._id)
    ) {
      return res.status(400).json({ message: "Already a member or request pending" });
    }

    club.pendingMembers.push(req.user._id);
    await club.save();

    res.json({ message: "Join request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Approve member request
// @route PUT /api/clubs/:id/approve/:userId
// @access Lead
approveMember = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    // Only a lead can approve
    if (!club.leads.includes(req.user._id)) {
      return res.status(403).json({ message: "Only club leads can approve members" });
    }

    const userId = req.params.userId;
    if (!club.pendingMembers.includes(userId)) {
      return res.status(400).json({ message: "No pending request from this user" });
    }

    // Move from pending → members
    club.pendingMembers.pull(userId);
    club.members.push(userId);

    await club.save();
    res.json({ message: "Member approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Assign a lead to a club (multiple leads supported)
// @route PUT /api/clubs/:id/assign-lead/:userId
// @access Admin
assignLead = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (club.leads.includes(userId)) {
      return res.status(400).json({ message: "User is already a lead" });
    }

    // Update club
    club.leads.push(userId);
    if (!club.members.includes(userId)) {
      club.members.push(userId);
    }
    await club.save();

    // Update user role
    user.role = "clublead";
    await user.save();

    // 🔑 Generate new token with updated role
    const newToken = generateToken(user._id, user.role);

    res.json({
      message: "Lead assigned",
      club,
      user,
      token: newToken, // send updated token back
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Remove a lead from a club
// @route PUT /api/clubs/:id/remove-lead/:userId
// @access Admin
removeLead = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const userId = req.params.userId;

    if (!club.leads.includes(userId)) {
      return res.status(400).json({ message: "User is not a lead" });
    }

    club.leads.pull(userId);
    await club.save();

    res.json({ message: "Lead removed", club });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a club
// @route DELETE /api/clubs/:id
// @access Admin
deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    await club.deleteOne();
    res.json({ message: "Club deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Get clubs related to logged-in user
// @route GET /api/clubs/my
// @access Private
getMyClubs = async (req, res) => {
  try {
    const userId = req.user._id;

    const myClubs = await Club.find({
      members: userId,
    })
      .populate("leads", "name email")
      .populate("members", "name email");

    const pendingApplications = await Club.find({
      pendingMembers: userId,
    }).select("name _id createdAt");

    res.json({
      myClubs,
      pendingApplications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all club details (for Faculty/HOD only)
// @route GET /api/clubs/all/details
// @access Faculty/HOD
const getAllClubDetails = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("leads", "name email role")
      .populate("members", "name email role")
      .populate("pendingMembers", "name email role")
      .select("name description createdAt updatedAt");

    res.json({
      totalClubs: clubs.length,
      clubs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select('name email _id role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};

