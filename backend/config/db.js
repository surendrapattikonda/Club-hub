const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.atlas_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected:'`);
  } catch (error) {
    console.error("X MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
