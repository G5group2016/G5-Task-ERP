require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const hpp = require("hpp");

const connectDB = require("./config/db");

const companyRoutes = require("./routes/companyRoutes");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const taskRoutes = require("./routes/taskRoutes");
const workReportRoutes = require("./routes/workReportRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const profileImageRequestRoutes = require("./routes/profileImageRequestRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

/* -------------------- Middleware -------------------- */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(compression());
app.use(hpp());

/* -------------------- Health Routes -------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "G5 Task ERP Backend is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

/* -------------------- API Routes -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/work-reports", workReportRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(
  "/api/profile-image-requests",
  profileImageRequestRoutes
);
app.use("/api/chat", chatRoutes);

/* -------------------- Error Handler -------------------- */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* -------------------- Process Error Handlers -------------------- */

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION");
  console.error(err);
});

/* -------------------- Start Server -------------------- */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();