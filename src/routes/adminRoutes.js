const express = require("express");
const router = express.Router();

const {
  addDoctorForm,
  registerDoctor,
  viewDoctors,
  deleteDoctor,
  addReceptionForm,
  registerReception,
  viewReceptions,
  deleteReception,
  viewPatients
} = require("../controllers/adminController");

// ====== Doctor Management ======
router.get("/doctor", addDoctorForm);               // Show Add Doctor Form
router.post("/doctor", registerDoctor);             // Register Doctor
// router.get("/doctors", viewDoctors);                 // View All Doctors
// router.post("/doctors/delete/:id", deleteDoctor);    // Delete Doctor

// // ====== Receptionist Management ======
// router.get("/add-reception", addReceptionForm);       // Show Add Receptionist Form
// router.post("/add-reception", registerReception);     // Register Receptionist
// router.get("/receptions", viewReceptions);            // View All Receptionists
// router.post("/receptions/delete/:id", deleteReception); // Delete Receptionist

// // ====== Patient View ======
// router.get("/patients", viewPatients);                // View All Patients

module.exports = router;