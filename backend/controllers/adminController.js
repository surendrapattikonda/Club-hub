const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @desc Create Faculty / HOD
const createUser = async (req, res) => {
  try {
    const { name, email, reg, password, role, year } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Only allow faculty or HOD creation
    if (!["faculty", "hod"].includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      reg,
      password,
      role: role.toLowerCase(),
      year,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      reg: user.reg,
      year: user.year,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser };
