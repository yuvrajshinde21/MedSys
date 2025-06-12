const { authenticateUser } = require("../models/authModel");
const asynchandler = require("express-async-handler")

// @desc render login.ejs
// @route GET: "auth/login"
// @access public
exports.getLoginPage = function (req, res) {
    res.render("login.ejs", { message: "" });
}

exports.getRegisterDoctorPage = function (req, res) {
    res.render("registerDoctor.ejs", { partialToInclude: true });
}

exports.getViewDoctorsPage = function (req, res) {
    res.render("viewDoctors.ejs", { partialToInclude: true });
}

exports.getRegisterReceptionistPage = function (req, res) {
    res.render("registerReception.ejs", { partialToInclude: true });
}
// @desc register doctor
// @route POST: "auth/register/doctor"
// @access public
exports.handleLogin = asynchandler(async function (req, res) {
    const userData = req.body;
    if (!userData.username || !userData.password || !userData.role) {
        return res.render("login.ejs", { error: "username , passward and roule required" })
    }

    const user = await authenticateUser(userData);
    if (!user) {
        throw new Error("Invalid user!");
    }
    const user_id = user.user_id;
    const username = user.username;
    const password = user.password;
    const role = user.role;
    //admin
    if (role === "admin") {
        res.render("adminDashboard", { partialToInclude: false });
    } else if (role === "Receptionist") {
    } else if (role == "doctor") {
        res.render("receptionDashboard", { partialToInclude: false });
    } else if (role == "reception") {
        res.render("doctorDashboard", { partialToInclude: false });
    } else { 
        res.render("login.ejs", { error: "invalid username or password" })
    }
})

