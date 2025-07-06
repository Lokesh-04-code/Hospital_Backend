// models/Doctor.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const doctorSchema = mongoose.Schema(
  {
    name: {
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
    specialization: {
      type: String,
    },

    // 💡 daily slots
    dailySlots: [
      {
        date: {
          type: String, // e.g., "2025-07-06"
          required: true,
        },
        slots: [
          {
            time: {
              type: String, // e.g., "10:30"
              required: true,
            },
            isBooked: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
