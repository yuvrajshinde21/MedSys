const express = require("express");
const router = express.Router();

const { getLoginPage, handleLogin } = require("../controllers/authController")

router.route("/login").get(getLoginPage).post(handleLogin);

module.exports = router;