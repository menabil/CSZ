const mongoose = require("mongoose");

let isConnected = false;

const mongoDBConfig = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.MONGODB_URL) {
    console.error("MONGODB_URL environment variable is missing!");
    return;
  }

  return mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      isConnected = true;
      console.log("mongoDB connected");
    })
    .catch((error) => {
      console.log("mongoDB connection error:", error);
    });
};

module.exports = mongoDBConfig;
