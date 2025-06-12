const express = require("express");
const router = express.Router();

const { getLoginPage, handleLogin, getRegisterDoctorPage, getViewDoctorsPage, getRegisterReceptionistPage } = require("../controllers/authController")

router.route("/login").get(getLoginPage).post(handleLogin);
router.route("/addDoctor").get(getRegisterDoctorPage);
router.route("/viewDoctors").get(getViewDoctorsPage);
router.route("/registerReception").get(getRegisterReceptionistPage)
// router.route("/register/receptionist").post(handleRegisterReceptionist);
// router.route("/register/doctor").post(handleRegisterDoctor);
module.exports = router;