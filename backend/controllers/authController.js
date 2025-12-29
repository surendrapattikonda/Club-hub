const User = require("../models/User");
const jwt = require("jsonwebtoken");

// utils/generateToken.js
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "15m", // short-lived access token
  });
};

module.exports = generateToken;


// @desc Signup (Students Only)
const signup = async (req, res) => {
  try {
    const { name, email, regNo, password, year} = req.body;

    if (!name || !email || !password || !regNo || !year) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      regNo,
      year,
      password,
      role: "student", // 🔹 students self-register
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      regNo: user.regNo,
      year: user.year,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login (All roles)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      regNo: user.regNo,
      year: user.year,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login };
