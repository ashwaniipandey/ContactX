const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/contactx",
      {
        serverSelectionTimeoutMS: 5000,
      }
    );

    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 Tip: Make sure MongoDB service is running locally on 27017 or provide a MongoDB Atlas URI in backend/.env`);
    // Do not crash the entire process so server can still serve health check
  }
};

module.exports = connectDB;

