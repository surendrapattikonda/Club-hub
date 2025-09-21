const Activity = require("../models/Activity");
const Club = require("../models/Club");

// Add new activity
const addActivity = async (req, res) => {
  try {
    const { name, description } = req.body;
    const activity = await Activity.create({
      name,
      description,
      club: req.user.club,
    });
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View members of the club
const viewMembers = async (req, res) => {
  try {
    const club = await Club.findById(req.user.club).populate("members", "-password");
    res.json(club.members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get activities of logged-in student
const getStudentActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ club: req.user.club, participants: req.user._id });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addActivity, viewMembers, getStudentActivities };
