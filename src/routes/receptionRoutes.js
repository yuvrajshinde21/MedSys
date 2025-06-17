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

// Update room status
router.get("/rooms/edit/:roomId", receptionController.getRoomById); // GET /reception/rooms/edit/:roomId

// POST /reception/rooms/:roomId/status
router.post("/rooms/:roomId/update", receptionController.updateRoom);

//Delete room
router.post("/rooms/delete/:roomId", receptionController.deleteRoom); // POST /reception/rooms/:roomId/delete

// Optionally allow GET for delete (not recommended for production, but useful for testing)
router.get("/rooms/delete/:roomId", receptionController.deleteRoom); // GET /reception/rooms/delete/:roomId

// ---------------------- Nurses ----------------------
// List all nurses
router.get("/nurses", receptionController.viewNurses);        // GET /reception/nurses

// Show add nurse form
router.get("/nurses/new", receptionController.addNurse);      // GET /reception/nurses/new

// Create nurse
router.post("/nurses", receptionController.saveNurse);        // POST /reception/nurses

// Update nurse
router.get("/nurse/edit/:nurseId", receptionController.getNurseById);// GET /reception/nurses/edit/:nurseId

// POST /reception/nurses/:nurseId/update
router.post("/nurses/:nurseId/update", receptionController.updateNurse);


// Optionally allow GET for delete (not recommended for production, but useful for testing)
router.get("/nurse/delete/:nurseId", receptionController.deleteNurse); // GET /reception/nurse/delete/:nurseId

// ---------------------- Patients ----------------------
// List all patients
router.get("/patients", receptionController.viewPatients);    // GET /reception/patients

// Show add patient form
router.get("/patients/new", receptionController.addPatientForm); // GET /reception/patients/new

// Create patient
router.post("/patients", receptionController.savePatient);    // POST /reception/patients

module.exports = router;