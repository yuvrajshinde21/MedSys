const adminModel = require("../models/adminModel");
const asynchandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @Desc render addDoctorForm
// @route GET: admin/doctor 
exports.addDoctorForm = (req, res) => {
    res.render("admin/adminDashboard.ejs", {
        main_content: "addDoctor",
    })
}

// @Desc insert doctor
// @route POST: admin/doctor 
exports.registerDoctor = asynchandler(async (req, res) => {
    const doctor_name = req.body.doctor_name?.trim();
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();
    const doctor_specialization = req.body.doctor_specialization?.trim();
    const doctor_contact = req.body.doctor_contact?.trim();
    const doctor_email = req.body.doctor_email?.trim();
    const doctor_experience = req.body.doctor_experience?.trim();
    const status = req.body.status?.trim();
    const admin_id = req.body.admin_id;
    const doctorImage = req.file ? req.file.filename : null;


    if (!doctor_name || !username || !password || !doctor_specialization || !doctor_contact || !doctor_email || !doctor_experience || !status || !admin_id) {
        return res.render("admin/adminDashboard.ejs", {
            main_content: "addDoctor",
            user_id: req.user.user_id,
            errorMessage: "All required fields must be filled.",
        })
    }

    const userNameExists = await adminModel.isUserNameTaken(username);
    if (userNameExists) {
        return res.render("admin/adminDashboard.ejs", {
            main_content: "addDoctor",
            user_id: req.user.user_id,
            errorMessage: "Username is already taken. Try another.",
        })
    }
    //register user
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const doctor_id = await adminModel.createUser(username, hashedPassword, "doctor");
    const insertCount = await adminModel.createDoctor(doctor_name, doctor_specialization, doctor_contact, doctor_email, doctor_experience, status, doctor_id, admin_id, doctorImage)
    if (insertCount === 1) {
        return res.render("admin/adminDashboard.ejs", {
            main_content: "addDoctor",
            errorMessage: "Doctor registered successfully ✅",
        });
    } else {
        return res.render("admin/adminDashboard.ejs", {
            main_content: "addDoctor",
            errorMessage: "Something went wrong while saving the doctor ❌",
        });
    }
})

// @Desc view Doctors
// @route GET: admin/doctors
module.exports.viewDoctors = asynchandler(async (req, res) => {
    const doctors = await adminModel.getDoctors();
    // console.log(doctors)
    res.render("admin/adminDashboard.ejs", {
        main_content: "viewDoctors",
        doctors:doctors,
        errorMessage: null,
    })
})

// @Desc delete Doctor
// @route DELETE: admin/doctors/delete/:id
exports.deleteDoctor = asynchandler(async (req, res) => {
    const doctorId = req.params.id;
    const deleteCount = await adminModel.deleteDoctor(doctorId);
    if (deleteCount === 1) {
    return res.status(200).json({ message: "Doctor deleted successfully ✅" });
  } else {
    return res.status(500).json({ message: "Something went wrong while deleting the doctor ❌" });
  }
});

//@Desc render getEditDoctorForm
//@route GET: admin/doctors/edit/:id
exports.getEditDoctorForm = asynchandler(async (req, res) => {
    const doctorId = req.params.id;
    const doctor = await adminModel.getDoctorById(doctorId);
    if (!doctor) {
        return res.status(404).render("admin/adminDashboard.ejs", {
            main_content: "viewDoctors",
            errorMessage: "Doctor not found.",
        });
    }
    res.render("admin/adminDashboard.ejs", {
        main_content: "editDoctor",
        doctor: doctor,
    });
});

exports.editDoctor = asynchandler(async (req, res) => {
    const doctorId = req.params.id;
    const doctor_name = req.body.doctor_name?.trim();
    const doctor_specialization = req.body.doctor_specialization?.trim();
    const doctor_contact = req.body.doctor_contact?.trim();
    const doctor_email = req.body.doctor_email?.trim();
    const doctor_experience = req.body.doctor_experience?.trim();
    const status = req.body.status?.trim();
    const admin_id = req.body.admin_id;
    const doctorImage = req.file ? req.file.filename : null;

    if (!doctor_name || !doctor_specialization || !doctor_contact || !doctor_email || !doctor_experience || !status) {
        console.log( doctor_name, doctor_specialization, doctor_contact, doctor_email, doctor_experience, status);
        return res.render("admin/adminDashboard.ejs", {
            main_content: "editDoctor",
            doctor: {
                doctor_id: doctorId,
                doctor_name: doctor_name,
                doctor_specialization: doctor_specialization,
                doctor_contact: doctor_contact,
                doctor_email: doctor_email,
                doctor_experience: doctor_experience,
                status: status,
            },
            errorMessage: "All required fields must be filled.",
        });
    }

    const updateCount = await adminModel.updateDoctor(doctorId, doctor_name, doctor_specialization, doctor_contact, doctor_email, doctor_experience, status, admin_id, doctorImage);
    
    if (updateCount === 1) {
        //get doctors
        const doctors = await adminModel.getDoctors();
        return res.render("admin/adminDashboard.ejs", {
            main_content: "viewDoctors",
            doctors: doctors,
            errorMessage: "Doctor updated successfully ✅",
        });
    } else {
        return res.render("admin/adminDashboard.ejs", {
            main_content: "editDoctor",
            errorMessage: "Something went wrong while updating the doctor ❌",
        });
    }
});

