const express = require("express");
const router = express.Router();
const receptionController = require("../controllers/receptionController");
const nurseController = require("../controllers/nurseController");
const patientController = require("../controllers/patientController");
const medicineController = require("../controllers/medicineController");
// const billingController = require("../controllers/billingController");

// ---------------------- Dashboard ----------------------
router.get("/", receptionController.showReceptionDashboard); // GET /reception

//========================search======================
router.get("/search-patients", receptionController.searchPatients);
//view patient
router.get("/view-patient/:patientId", patientController.viewSpecificPatientDetailsById);
//===========================================

// List all rooms
router.get("/rooms", receptionController.viewRooms);          // GET /reception/rooms

// // Show add room form (optional if frontend)
router.get("/rooms/new", receptionController.renderAddRoom);        // GET /reception/rooms/new

// // Create room
router.post("/rooms", receptionController.createRoom);          // POST /reception/rooms

// // Update room status
router.get("/rooms/edit/:roomId", receptionController.getRoomById); // GET /reception/rooms/edit/:roomId

// // POST /reception/rooms/:roomId/status
router.post("/rooms/:roomId/update", receptionController.updateRoom);

// //Delete room
router.post("/rooms/delete/:roomId", receptionController.deleteRoom); // POST /reception/rooms/:roomId/delete

// Optionally allow GET for delete (not recommended for production, but useful for testing)
router.get("/rooms/delete/:roomId", receptionController.deleteRoom); // GET /reception/rooms/delete/:roomId


//show all admited
router.get('/admitted-patients', receptionController.showAdmittedPatients);
//assign room
router.post('/assign-room/:id', receptionController.assignRoom);
//asssign nurse
router.post('/assign-nurse/:id', receptionController.assignNurse);
// ---------------------- Nurses ----------------------
// get all nurses
router.get("/nurses", nurseController.viewNurses);        // GET /reception/nurses

// Show add nurse form
router.get("/nurses/new", nurseController.addNurse);      // GET /reception/nurses/new

// Create nurse
router.post("/nurses", nurseController.saveNurse);        // POST /reception/nurses

// Update nurse
router.get("/nurse/edit/:nurseId", nurseController.getNurseById);// GET /reception/nurses/edit/:nurseId

// POST /reception/nurses/:nurseId/update
router.post("/nurses/:nurseId/update", nurseController.updateNurse);


router.get("/nurse/delete/:nurseId", nurseController.deleteNurse); // GET /reception/nurse/delete/:nurseId

// ---------------------- Patients --viewPatientDetails--------------------
//patient
router.get("/patients/add", patientController.loadAppointmentForm);
router.post("/patients/create", patientController.createPatientAppointment);
//get doctor list by spelization id
router.get("/doctors/:id", patientController.getDoctorsBySpecialization);

router.get("/doctors/:doctorId/slots", patientController.getDoctorAvailableSlots);


// List all patients
router.get("/patients", patientController.getAllPatients);    // GET /reception/patients


//edit patient
router.route("/patients/edit/:patient_id").get(patientController.renderEditPatientForm).post(patientController.updatePatientDetails);




// ---------------------- Medicine ----------------------

// Show add medicine form
router.get("/medicines/new", medicineController.addMedicine); // GET /reception/

// Save medicine
router.post("/medicines", medicineController.saveMedicine); // POST /reception/medicines

//view all medicines
router.get("/medicines", medicineController.viewMedicines); // GET /reception/medicines

//delete medicine
router.post("/medicines/delete/:medicineId", medicineController.deleteMedicine); // POST /reception/medicines/delete/:medicineId


//======================= bill=============================

// Show bill generation form
router.get('/print-bill/:patientId', receptionController.renderPrintBill);

router.get("/patients/bill/:patientId", receptionController.generateBill);

//


module.exports = router;