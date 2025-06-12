// @desc render login.ejs
// @route GET: "auth/login"
// @access public
exports.getLoginPage = function (req, res) {
    res.render("login.ejs");
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
exports.handleLogin = function (req, res) {
    const { username, password, role } = req.body;

    if (role === "admin") {
        res.render("adminDashboard", { partialToInclude: false });
    } else if (role === "Receptionist") {
        res.render("receptionDashboard", { partialToInclude: false });
    } else if (role === "doctor") {
        res.render("adminDashboard", { partialToInclude: false });
    }
}
