// controllers/slotController.js
const Doctor = require("../models/DoctorModel");

const generateTimeSlots = (start = "09:00", end = "16:00", interval = 30) => {
  const slots = [];
  let [hour, minute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  while (hour < endHour || (hour === endHour && minute < endMinute)) {
    const formatted = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    slots.push({ time: formatted, isBooked: false });

    minute += interval;
    if (minute >= 60) {
      hour += 1;
      minute -= 60;
    }
  }

  return slots;
};

const generateDoctorSlots = async (req, res) => {
  const doctorId = req.params.id;
  const { date } = req.body;

  if (!date) return res.status(400).json({ message: "Date is required" });

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const exists = doctor.dailySlots.find((d) => d.date === date);
    if (exists)
      return res
        .status(400)
        .json({ message: "Slots for this date already exist" });

    const newDay = {
      date,
      slots: generateTimeSlots("09:00", "16:00", 30),
    };

    doctor.dailySlots.push(newDay);
    await doctor.save();

    res.status(201).json({ message: "Slots generated", slots: newDay });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

module.exports = { generateDoctorSlots };
