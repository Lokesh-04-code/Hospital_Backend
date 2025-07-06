const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getAllPatients,
  getAllAppointments,registerAdmin,loginAdmin
} = require("../controllers/adminController");

const validateToken = require("../middleware/validateTokenHandler"); // you must create this

router.get("/doctors", validateToken,getAllDoctors);
router.get("/patients",validateToken, getAllPatients);
router.get("/appointments",validateToken, getAllAppointments);
router.post('/register',registerAdmin);
router.post('/login',loginAdmin);
module.exports = router;
