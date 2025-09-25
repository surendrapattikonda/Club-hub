// controllers/adminController.js
const User = require("../models/User");

// ✅ Create Faculty or HOD
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Ensure only faculty or HOD can be created
    if (!["faculty", "hod"].includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Admins can only create Faculty or HOD users." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: `${role} created successfully`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete Faculty or HOD
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure only faculty or HOD can be deleted
    if (!["faculty", "hod"].includes(user.role.toLowerCase())) {
      return res.status(403).json({ message: "Admins can only delete Faculty or HOD users." });
    }

    await user.deleteOne();
    res.json({ message: `${user.role} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all faculty
const getFaculty = async (req, res) => {
  try {
    const faculty = await User.find({ role: "faculty" }).select("-password"); // hide password
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { createUser, deleteUser, getFaculty };
