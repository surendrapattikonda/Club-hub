const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.atlas_URI, {
      dbName: "club_db",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected:'`);
    console.log(mongoose.connection.name);

  } catch (error) {
    console.error("X MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
