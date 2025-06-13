const adminModel = require("../models/adminModel");
const asynchandler = require("express-async-handler");

// @Desc render addDoctorForm
// @route GET: admin/doctor 
exports.addDoctorForm = (req, res) => {
    res.render("admin/adminDashboard.ejs", {

        main_content: "addDoctor",
        user_id: req.user.user_id
    })
}
// @Desc insert doctor
// @route POST: admin/doctor 
exports.registerDoctor = asynchandler(async (req, res) => {
    const { doctor_name, username, password, doctor_specialization, doctor_contact, doctor_email, doctor_experience, status, admin_id } = req.body;

    if (!doctor_name || !username || !password || !doctor_specialization || !doctor_contact || !doctor_email || !doctor_experience || !status || !admin_id) {
        return res.render("admin/adminDashboard.ejs", {
            main_content: "addDoctor",
            user_id: req.user.user_id,
            errorMessage: "All required fields must be filled.",
        })
    }

    const userNmaeExists = await adminModel.isUserNameTaken(username);
    if (userNmaeExists) {
        return res.render("admin/adminDashboard.ejs", {
            main_content: "addDoctor",
            user_id: req.user.user_id,
            errorMessage: "Username is already taken. Try another.",
        })
    }
    //register user
    const doctor_id = await adminModel.createUser(username, password, "doctor");
    const insertCount = await adminModel.createDoctor(doctor_name, doctor_specialization, doctor_contact, doctor_email, doctor_experience, status, doctor_id, admin_id)
      if (insertCount === 1) {
        return res.render("admin/adminDashboard.ejs", {
            main_content: "addDoctor",
            user_id: req.user.user_id,
            errorMessage: "Doctor registered successfully ✅",
        });
    } else {
        return res.render("admin/adminDashboard.ejs", {
            main_content: "addDoctor",
            user_id: req.user.user_id,
            errorMessage: "Something went wrong while saving the doctor ❌",
        });
    }
})

