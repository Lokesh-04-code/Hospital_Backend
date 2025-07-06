const express = require("express");
const router = express.Router();
const {
  registerPatient,
  loginPatient,
  updateDetails,
  currentPatient,
  getAllPatients,
} = require("../controllers/patientController");
const validateToken = require("../middleware/validateTokenHandler");

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/update", validateToken, updateDetails);
router.get("/current", validateToken, currentPatient);
router.get("/all", getAllPatients);
module.exports = router;
