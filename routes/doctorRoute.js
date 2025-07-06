const express = require("express");
const router = express.Router();

const validateToken = require("../middleware/validateTokenHandler");
const {
  registerDoctor,
  loginDoctor,
  currentDoctor,
  getAllDoctors,
} = require("../controllers/DoctorController");

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.get("/current", validateToken, currentDoctor);
router.get("/all", getAllDoctors);
module.exports = router;
