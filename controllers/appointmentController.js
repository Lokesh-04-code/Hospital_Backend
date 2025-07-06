const asyncHandler = require("express-async-handler");
const Patient = require("../models/PatientModel");
const Doctor = require("../models/DoctorModel");
const Appointment = require("../models/appointmentModel");
const jwt = require("jsonwebtoken");

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private (patient only)
const createAppointment = asyncHandler(async (req, res) => {
  const patientId = req.user.id; // from auth middleware
  const { doctorId, date, time } = req.body;

  if (!doctorId || !date || !time) {
    return res
      .status(400)
      .json({ message: "doctorId, date, and time are required" });
  }

  // Find doctor
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  // Find the slot for given date
  const daySlots = doctor.dailySlots.find((d) => d.date === date);
  if (!daySlots) {
    return res
      .status(400)
      .json({ message: "Doctor not available on this date" });
  }

  // Find the time slot
  const timeSlot = daySlots.slots.find((s) => s.time === time);
  if (!timeSlot) {
    return res.status(400).json({ message: "Time slot not found" });
  }

  if (timeSlot.isBooked) {
    return res.status(409).json({ message: "This slot is already booked" });
  }

  // Mark slot as booked
  timeSlot.isBooked = true;
  await doctor.save();

  // Create appointment
  const appointment = await Appointment.create({
    patient: patientId,
    doctor: doctorId,
    date,
    time,
    status: "booked",
  });

  res.status(201).json({
    message: "Appointment created successfully",
    appointment,
  });
});

// @desc    Get all appointments of logged-in patient
// @route   GET /api/appointments/mine
// @access  Private (patient only)
const getPatientAppointments = asyncHandler(async (req, res) => {
  const patientId = req.user.id;

  const appointments = await Appointment.find({ patient: patientId })
    .populate("doctor", "name specialization email")
    .populate("patient", "username email") // optional: show doctor details
    .sort({ date: 1, time: 1 }); // sort by upcoming

  res.status(200).json({
    count: appointments.length,
    appointments,
  });
});

// @desc    Get all appointments for logged-in doctor
// @route   GET /api/appointments/doctor
// @access  Private (doctor only)
const getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;

  const appointments = await Appointment.find({ doctor: doctorId })
    .populate("patient", "username email")
    .populate("doctor", "name specialization email") // optional: show patient info
    .sort({ date: 1, time: 1 });

  res.status(200).json({
    count: appointments.length,
    appointments,
  });
});

const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate("patient", "username email")
    .populate("doctor", "name specialty email")
    .sort({ date: 1, time: 1 });

  res.status(200).json({
    count: appointments.length,
    appointments,
  });
});

module.exports = {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAllAppointments
};
