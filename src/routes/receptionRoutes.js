const express = require("express");
const router = express.Router();
const receptionController = require("../controllers/receptionController");

// ---------------------- Dashboard ----------------------
router.get("/", receptionController.showReceptionDashboard); // GET /reception

// ---------------------- Rooms ----------------------
// List all rooms
router.get("/rooms", receptionController.viewRooms);          // GET /reception/rooms

// Show add room form (optional if frontend)
router.get("/rooms/new", receptionController.addRoom);        // GET /reception/rooms/new

// Create room
router.post("/rooms", receptionController.saveRoom);          // POST /reception/rooms

// ---------------------- Nurses ----------------------
// List all nurses
router.get("/nurses", receptionController.viewNurses);        // GET /reception/nurses

// Show add nurse form
router.get("/nurses/new", receptionController.addNurse);      // GET /reception/nurses/new

// Create nurse
router.post("/nurses", receptionController.saveNurse);        // POST /reception/nurses

// ---------------------- Patients ----------------------
// List all patients
router.get("/patients", receptionController.viewPatients);    // GET /reception/patients

// Show add patient form
router.get("/patients/new", receptionController.addPatientForm); // GET /reception/patients/new

// Create patient
router.post("/patients", receptionController.savePatient);    // POST /reception/patients

module.exports = router;