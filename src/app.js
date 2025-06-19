const express = require("express");
const app = express();
const path = require("path");
const cookieparser = require("cookie-parser");
const errorHandler = require("../src/middleware/errorhandler")
const authMiddleware = require("../src/middleware/authMiddleware")
const isDoctor = require("../src/middleware/isDoctor")
//
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const receptionRoutes = require("./routes/receptionRoutes");

//set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(express.json());
app.use(cookieparser());

//routes
app.use("/", homeRoutes);
app.use("/auth", authRoutes);
//auth routes:
app.use("/admin", authMiddleware, adminRoutes);
app.use("/doctor", authMiddleware, isDoctor.isDoctor, doctorRoutes);

app.use("/reception", authMiddleware, receptionRoutes);


app.use(errorHandler)

module.exports = app;



// 	/auth/login, /auth/register
// 	/admin/add, /doctor/list, /reception/add
// 	/patient/admit, /patient/discharge, /bill/generate
