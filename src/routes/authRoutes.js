const express = require("express");
const router = express.Router();

const { getLoginPage, handleLogin, logoutUser } = require("../controllers/authController")

router.route("/login").get(getLoginPage).post(handleLogin);
router.route("/logout").get(logoutUser);

module.exports = router;