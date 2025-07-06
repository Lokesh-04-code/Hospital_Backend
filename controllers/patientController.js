const asyncHandler = require("express-async-handler");
const patient = require("../models/PatientModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerPatient = asyncHandler(async (req, res) => {
  console.log("registered student started");
  const { username, email, password } = req.body;
  console.log(username, email, password);
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("please fill all the details");
  }
  console.log("data getted");

  const patientsAvailable = await patient.findOne({ email });
  console.log("student available check");
  if (patientsAvailable) {
    res.status(400);
    throw new error("studet already registered");
  }
  const hashpassword = await bcrypt.hash(password, 10);
  const Patient = await patient.create({
    username: username,
    email: email,
    password: hashpassword,
  });
  if (Patient) {
    res.status(201).json({
      _id: Patient._id,
      email: Patient.email,
    });
  } else {
    res.status(400);
    throw new Error("student data is not valid");
  }
});

const loginPatient = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("please fill the all details");
  }
  const user = await patient.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accesstoken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res
      .status(200)
      .json({ status: "success", token: accesstoken, id: user._id });
  } else {
    res.status(401);
    throw new ErrorEvent("email or password is not valid");
  }
});
const currentPatient = asyncHandler(async (req, res) => {
  const { email } = req.user;
  if (!email) {
    res.status(400);
    throw new Error("Email is missing");
  }
  const Patient = await patient.findOne({ email });
  if (!Patient) {
    res.status(404);
    throw new Error("student is missing");
  }
  res.status(200).json(Patient);
});

const updateDetails = asyncHandler(async (req, res) => {
  const { email } = req.user;
  if (!email) {
    res.status(400);
    throw new Error("Email is missing");
  }
  const Patient = await patient.findOne({ email });
  if (!Patient) {
    res.status(404);
    throw new error("patient not found");
  }
  const updatedDetails = await patient.findOneAndUpdate(
    { email },
    { $set: req.body },
    { new: true } // returns the updated document
  );
  res.status(200).json(updatedDetails);
});
const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await patient.find({}, { password: 0 }); // Exclude password
  res.status(200).json(patients);
});

module.exports = {
  registerPatient,
  loginPatient,
  updateDetails,
  currentPatient,
  getAllPatients,
};
