const express = require("express");
const app = express();
const path = require("path");
//
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");

//set view engine
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"..","views"));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(express.json());

//routes
app.use("/",homeRoutes);
app.use("/auth",authRoutes);

module.exports = app;



// 	/auth/login, /auth/register
// 	/admin/add, /doctor/list, /reception/add
// 	/patient/admit, /patient/discharge, /bill/generate
