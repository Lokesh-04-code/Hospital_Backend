// models/Patient.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const patientSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: String,
    gender: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", patientSchema);
