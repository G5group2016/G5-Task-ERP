


require("dotenv").config();

const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const cookieParser =
    require("cookie-parser");

const mongoSanitize =
    require("express-mongo-sanitize");

const compression =
    require("compression");

const hpp = require("hpp");

const connectDB =
    require("./config/db");

const companyRoutes =
    require("./routes/companyRoutes");

const authRoutes =
    require("./routes/authRoutes");

const employeeRoutes =
    require("./routes/employeeRoutes");

const taskRoutes =
require("./routes/taskRoutes");    

const workReportRoutes =
require(
 "./routes/workReportRoutes"
);

const attendanceRoutes =
require(
 "./routes/attendanceRoutes"
);

const dashboardRoutes =
require("./routes/dashboardRoutes");


const app = express();

connectDB();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use(mongoSanitize());

app.use(compression());

app.use(hpp());

app.use("/api/auth", authRoutes);
app.use(
    "/api/companies",
    companyRoutes
);
app.use(
    "/api/employees",
    employeeRoutes
);
app.use(
  "/api/tasks",
  taskRoutes
);
app.use(
 "/api/work-reports",
 workReportRoutes
);
app.use(
 "/api/attendance",
 attendanceRoutes
);

app.use(
 "/api/dashboard",
 dashboardRoutes
);

app.listen(
    process.env.PORT,
    () => {
        console.log(
            `Server running on port ${process.env.PORT}`
        );
    }
);