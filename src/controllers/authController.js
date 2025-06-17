const asynchandler = require("express-async-handler");
const { authenticateUser, getUserById } = require("../models/authModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// @desc render login.ejs
// @route GET: "auth/login"
// @access public
exports.getLoginPage = function (req, res) {
  res.render("login.ejs", { message: "" });
};

// @desc register doctor
// @route POST: "auth/register/doctor"
// @access public
exports.handleLogin = asynchandler(async function (req, res) {
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    if (!username || !password) {
        return res.render("login.ejs", {
            error: "Username and password are required"
        });
    }
    //authenticate user
    const user = await authenticateUser(username);
    if (!user) {
        return res.render("login.ejs", {
            error: "Invalid username "
        });
    }
    const isUser = await bcrypt.compare(password, user.password);
    if (!isUser) {
        return res.render("login.ejs", {
            error: "Invalid password"
        });
    }
    //set jwt
    const token = jwt.sign(
        {
            user_id: user.user_id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
    //set cookie
    res.cookie("token", token,
        {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        })

    //admin
    const receptionist = await getUserById(user.user_id);
    if (user.role === "admin") {
        return res.render("admin/adminDashboard");
    } else if (user.role === "doctor") {
        return res.render("doctor/doctorDashboard.ejs", {
            main_content:"doctorInfo",
            doctorName: "John Doe",
            totalAppointments: 12,
            todaysPatients: 5,
            pendingPrescriptions: 3,
            appointments: [
                {
                    time: "10:00 AM",
                    patient_name: "Alice Smith",
                    reason: "Headache",
                    status: "Pending"
                },
                {
                    time: "11:30 AM",
                    patient_name: "Bob Jones",
                    reason: "Fever",
                    status: "Completed"
                }
            ]
        });

    } else if (user.role === "reception") {
        return res.render("reception/receptionDashboard.ejs", {
            main_content: "receptionistInfo", // ✅ match the actual filename
            receptionist: receptionist,
        });
    } else {
        return res.render("login.ejs", { error: "invalid user role!" });
    }

  //admin
  if (user.role === "admin") {
    console.log("admin");
    console.log(user.role);
    
    res.render("admin/adminDashboard");
  } else if (user.role === "doctor") {
    res.render("doctor/doctorDashboard");
  } else if (user.role === "reception") {
    res.render("reception/receptionDashboard");
  } else {
    res.render("login.ejs", { error: "invalid username or password" });
  }
});

exports.logoutUser = (req, res) => {

  res.clearCookie("token");
  res.redirect("/auth/login");
};
