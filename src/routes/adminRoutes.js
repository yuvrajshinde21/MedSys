const express = require("express");
const router = express.Router();
const upload = require("../config/uploadConfig")

const {
    addDoctorForm,
    registerDoctor,
    viewDoctors,
    deleteDoctor,
    editDoctor,
    getEditDoctorForm,
    addReceptionForm,
    registerReception,
    viewReceptions,
    deleteReception,
    getEditReceptionForm,
    editReception,  
    viewPatients
} = require("../controllers/adminController");

// ====== Doctor Management ======
router.get("/doctor", addDoctorForm);                   // Show Add Doctor Form
router.post("/doctor", upload.single("doctor_image"), registerDoctor);                 // Register Doctor
router.get("/doctors", viewDoctors);                 // View All Doctors
router.delete("/doctors/delete/:id", deleteDoctor);    // Delete Doctor
router.route("/doctors/edit/:id").get(getEditDoctorForm).post(upload.single("doctor_image"), editDoctor);    // Edit Doctor

// // ====== Receptionist Management ======
router.get("/reception", addReceptionForm);       // Show Add Receptionist Form
router.post("/reception",upload.single("reception_image"), registerReception);     // Register Receptionist
router.get("/receptions", viewReceptions);            // View All Receptionists
router.delete("/receptions/delete/:id", deleteReception); // Delete Receptionist
router.get("/reception/edit/:id", getEditReceptionForm); // Get Edit Receptionist Form
router.post("/reception/edit/:id", upload.single("reception_image"), editReception); // Edit Receptionist
// // ====== Patient View ======
// router.get("/patients", viewPatients);                // View All Patients

module.exports = router;