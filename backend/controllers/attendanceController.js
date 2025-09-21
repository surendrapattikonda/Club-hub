const Attendance = require("../models/Attendance");


// Mark attendance for an activity
const markAttendance = async (req, res) => {
  try {
    const { eventId, attendees } = req.body;
    const attendance = await Attendance.create({
      event: eventId,
      attendees,
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View attendance by activity
const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ event: req.params.eventId })
      .populate("attendees", "name email");
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { markAttendance, getAttendance };

