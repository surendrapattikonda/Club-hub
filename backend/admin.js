const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    //  Wait for DB connection
    await mongoose.connect(process.env.atlas_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    await User.create({
      name: "Data science Admin",
      email: "admin@example.com",
      regNo: "ADM001",
      password: "Admin123",
      role: "admin",
      year: "N/A",
    });

    console.log(" Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
