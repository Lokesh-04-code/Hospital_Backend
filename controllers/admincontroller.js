const Doctor = require("../models/DoctorModel");
const Patient = require("../models/PatientModel");
const Appointment = require("../models/appointmentModel");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill in all details");
  }

  const admin = await Admin.findOne({ email });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    const accessToken = jwt.sign(
      {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({ status: "success", token: accessToken });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});
// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private (admin only)
const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({});
  res.status(200).json(doctors);
});

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private (admin only)
const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({});
  res.status(200).json(patients);
});

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private (admin only)
const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate("doctor", "name specialization")
    .populate("patient", "name email");
  res.status(200).json(appointments);
});

module.exports = {
  getAllDoctors,
  getAllPatients,
  getAllAppointments,
  loginAdmin,
  registerAdmin,
};
