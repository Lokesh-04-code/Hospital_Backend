const asyncHandler = require("express-async-handler");
const doctor = require("../models/DoctorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerDoctor = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please fill all the details");
  }

  const DoctorAvailable = await doctor.findOne({ email });

  if (DoctorAvailable) {
    res.status(400);
    throw new Error("student already registered");
  }
  const hashpassword = await bcrypt.hash(password, 10);
  const Doctor = await doctor.create({
    name: name,
    email: email,
    password: hashpassword,
  });
  if (Doctor) {
    res.status(201).json({
      _id: Doctor._id,
      email: Doctor.email,
    });
  } else {
    res.status(400);
    throw new Error("student data is not valid");
  }
});

const loginDoctor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("please fill all the details");
  }
  const user = await doctor.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accesstoken = jwt.sign(
      {
        user: {
          username: user.name,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res.status(200).json({ status: "success", token: accesstoken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});


const currentDoctor = asyncHandler(async (req, res) => {
  const { email } = req.user;
  if (!email) {
    res.status(400);
    throw new Error("Email is missing");
  }
  const Doctor = await doctor.findOne({ email });
  if (!Doctor) {
    res.status(404);
    throw new Error("student is missing");
  }
  res.status(200).json(Doctor);
});
const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await doctor.find({}, { password: 0 }); // exclude password
  res.status(200).json(doctors);
});

module.exports = { registerDoctor, loginDoctor,currentDoctor,getAllDoctors };
