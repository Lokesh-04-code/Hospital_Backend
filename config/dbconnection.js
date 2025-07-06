const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Database connected successfully:", connect.connection.name);
  } catch (err) {
    console.log(err);
    process.exit(1); // ✅ Corrected line
  }
};

module.exports = connectDb;
