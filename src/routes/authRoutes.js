const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")

const { getLoginPage, handleLogin, logoutUser } = require("../controllers/authController")

router.route("/login").get(getLoginPage).post(handleLogin);
router.route("/logout").get(authMiddleware,logoutUser);

module.exports = router;