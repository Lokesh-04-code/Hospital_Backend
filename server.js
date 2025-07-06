const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/dbconnection");
dotenv.config();
connectDb();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
const patientRoutes = require("./routes/patientRoute");
const doctorRoutes = require("./routes/doctorRoute");
app.use("/api/patients", patientRoutes);
app.use("/api/doctor", doctorRoutes);
const slotRoutes = require("./routes/slotRoutes");
app.use("/api/slots", slotRoutes);
const appointmentRoutes = require("./routes/appointmentRoute");
app.use("/api/appointments", appointmentRoutes);
const adminRoutes = require("./routes/adminRoute");
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
