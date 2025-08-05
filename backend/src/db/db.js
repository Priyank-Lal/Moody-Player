const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Server connected to DB");
    })
    .catch((err) => {
      console.log("Error Connecting to DB");
    });
}

module.exports = connectDB;
