const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  const adminExists = await User.findOne({ role: "admin" });
  if (adminExists) {
    console.log("Admin already exists");
    process.exit();
  }

  await User.create({
    name: "Data science Admin",
    email: "pattikondasurendra05@gmail.com",
    reg: "ADM001",
    password: "AdminPass123", // will be hashed
    role: "admin",
    year: "N/A",
  });

  console.log("Admin created successfully");
  process.exit();
};

createAdmin();