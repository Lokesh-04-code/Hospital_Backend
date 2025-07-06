// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAllAppointments
} = require("../controllers/appointmentController");
const validateToken = require("../middleware/validateTokenHandler"); // middleware to verify token

router.post("/create", validateToken, createAppointment);
router.get("/patients", validateToken, getPatientAppointments);
router.get("/doctor", validateToken, getDoctorAppointments);
router.get("/all", getAllAppointments);
module.exports = router;
