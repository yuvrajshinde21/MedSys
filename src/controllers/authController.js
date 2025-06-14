const asynchandler = require("express-async-handler");
const { authenticateUser } = require("../models/authModel");
const jwt = require("jsonwebtoken");

// @desc render login.ejs
// @route GET: "auth/login"
// @access public
exports.getLoginPage = function (req, res) {
    res.render("login.ejs", { message: "" });
}

// @desc register doctor
// @route POST: "auth/register/doctor"
// @access public
exports.handleLogin = asynchandler(async function (req, res) {
    const userData = req.body;
    if (!userData.username || !userData.password || !userData.role) {
        return res.render("login.ejs", {
            error: "Username, password and role are required"
        })
    }
    //isUser
    const user = await authenticateUser(userData);
    if (!user) {
        return res.render("login.ejs", {
            error: "Invalid username or password"
        })
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
    if (user.role === "admin") {
        res.render("admin/adminDashboard");
    } else if (user.role === "doctor") {
        res.render("doctor/doctorDashboard");
    } else if (user.role === "reception") {
        res.render("reception/receptionDashboard");
    } else {
        res.render("login.ejs", { error: "invalid username or password" });
    }

})

exports.logoutUser = (req,res)=>{
    res.clearCookie("token");
    res.redirect("/auth/login");
}
