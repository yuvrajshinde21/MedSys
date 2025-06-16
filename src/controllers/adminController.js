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
        doctors: doctors,
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

//@Desc editDoctor
//@route POST: admin/doctors/edit/:id
exports.editDoctor = asynchandler(async (req, res) => {
    const doctorId = req.params.id;
    const doctor_name = req.body.doctor_name?.trim();
    const doctor_specialization = req.body.doctor_specialization?.trim();
    const doctor_contact = req.body.doctor_contact?.trim();
    const doctor_email = req.body.doctor_email?.trim();
    const doctor_experience = req.body.doctor_experience?.trim();
    const status = req.body.status?.trim();
    // const admin_id = req.body.admin_id;
    const doctorImage = req.file ? req.file.filename : req.body.existing_image;

    if (!doctor_name || !doctor_specialization || !doctor_contact || !doctor_email || !doctor_experience || !status) {
        console.log(doctor_name, doctor_specialization, doctor_contact, doctor_email, doctor_experience, status);
        return res.render("admin/adminDashboard.ejs", {
            main_content: "editDoctor",
            doctor: {
                doctor_id: parseInt(doctorId),
                doctor_name: doctor_name,
                doctor_specialization: doctor_specialization,
                doctor_contact: doctor_contact,
                doctor_email: doctor_email,
                doctor_experience: parseInt(doctor_experience),
                status: status,
            },
            errorMessage: "All required fields must be filled.",
        });
    }

    const updateCount = await adminModel.updateDoctor(doctorId, doctor_name, doctor_specialization, doctor_contact, doctor_email, doctor_experience, status, doctorImage);

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

// @Desc render addReceptionForm
// @route GET: admin/reception
exports.addReceptionForm = asynchandler(async (req, res) => {
    res.render("admin/adminDashboard.ejs", {
        main_content: "addReception",
        errorMessage: null,
    });
});

// @Desc insert receptionist
// @route POST: admin/reception
exports.registerReception = asynchandler(async (req, res) => {
    const reception_name = req.body.reception_name?.trim();
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();
    const reception_contact = req.body.reception_contact?.trim();
    const reception_email = req.body.reception_email?.trim();
    const status = req.body.status?.trim();
    const admin_id = 1; // Assuming admin_id is hardcoded for now, you can change this as per your logic
    const receptionImage = req.file ? req.file.filename : null; // Uncomment if you want to handle image upload  
    const role = "reception";

    if (!reception_name || !username || !password || !reception_contact || !reception_email || !status || !admin_id) {
        return res.render("admin/adminDashboard.ejs", {
            main_content: "addReception",
            errorMessage: "All required fields must be filled.",
        });
    }

    const userNameExists = await adminModel.isUserNameTaken(username);
    if (userNameExists) {
        return res.render("admin/adminDashboard.ejs", {
            main_content: "addReception",
            errorMessage: "Username is already taken. Try another.",
        });
    }

    //register user
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await adminModel.createReceptionWithUser(
        reception_name,
        username,
        hashedPassword,
        reception_contact,
        reception_email,
        status,
        admin_id,
        receptionImage,
        role
    );

    return res.render("admin/adminDashboard.ejs", {
        main_content: "addReception",
        errorMessage: result.message
    });

});
// @Desc view Receptionists
// @route GET: admin/receptionists
exports.viewReceptions = asynchandler(async (req, res) => {
    const receptionists = await adminModel.getReceptionists();
    res.render("admin/adminDashboard.ejs", {
        main_content: "viewReceptions",
        receptionists: receptionists,
        errorMessage: null
    });
});
// @Desc delete Receptionist
// @route DELETE: admin/receptionists/:id
exports.deleteReception = asynchandler(async (req, res) => {
    const receptionId = req.params.id;
    const deleteCount = await adminModel.deleteReception(receptionId);

    if (deleteCount === 1) {
        return res.status(200).json({ message: "Receptionist deleted successfully ✅" });
    } else {
        return res.status(404).json({ message: "Receptionist not found ❌" });
    }
});

// @Desc edit Receptionist
// @route GET: admin/receptionists/edit/:id
exports.getEditReceptionForm = asynchandler(async (req, res) => {
    const receptionId = req.params.id;
    const receptionist = await adminModel.getReceptionById(receptionId);
    if (!receptionist) {
        return res.status(404).render("admin/adminDashboard.ejs", {
            main_content: "viewReceptions",
            errorMessage: "Receptionist not found.",
        });
    }
    res.render("admin/adminDashboard.ejs", {
        main_content: "editReception",
        reception: receptionist,
    });
});
// @Desc update Receptionist
// @route POST: admin/receptionists/edit/:id
exports.editReception = asynchandler(async (req, res) => {
    const receptionId = parseInt(req.params.id.trim());
    const reception_name = req.body.reception_name?.trim();
    const reception_contact = parseInt(req.body.reception_contact?.trim());
    const reception_email = req.body.reception_email?.trim();
    const status = req.body.status?.trim(); 
    const receptionImage = req.file ? req.file.filename : req.body.existing_image;
    if (!reception_name || !reception_contact || !reception_email || !status) {
        return res.status(400).render("admin/adminDashboard.ejs", {
            main_content: "editReception",
            errorMessage: "All fields are required.",
            reception: {
                reception_id: receptionId,
                reception_name: reception_name,
                reception_contact: reception_contact,
                reception_email: reception_email,
                status: status,
                reception_image: receptionImage
            }
        });
    }

    const affectedRows = await adminModel.updateReception(
        receptionId,
        reception_name,
        reception_contact,
        reception_email,
        status,
        receptionImage
    );

    return res.render("admin/adminDashboard.ejs", {
        main_content: "viewReceptions",
        receptionists: await adminModel.getReceptionists(),
        errorMessage: "Receptionist updated successfully ✅",
    });
});
