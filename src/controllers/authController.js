// @desc render login.ejs
// @route GET: "auth/login"
// @access public
exports.getLoginPage = function (req, res) {
    res.render("login.ejs");
}

// @desc login
// @route POST: "auth/login"
// @access public
exports.handleLogin = function (req, res) {
    const { username, password, role } = req.body;

    if (role === "admin") {
        res.render("adminDashboard", { partialToInclude: false });
    } else if (role === "reception") {
        res.render("receptionDashboard", { partialToInclude: false });
    } else if (role === "doctor") {
        res.render("adminDashboard", { partialToInclude: false });
    }
}
