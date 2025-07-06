// routes/slotRoutes.js
const express = require("express");
const router = express.Router();
const { generateDoctorSlots } = require("../controllers/slotController");

router.post("/doctor/:id/generate-slots", generateDoctorSlots);

module.exports = router;
