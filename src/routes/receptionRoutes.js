
//Router API Reception
const express = require("express");
const router = express.Router();
const roomCtrl=require("../controllers/receptionController");

//Show Reception Dashboard
router.get("/", roomCtrl.showReceptionDashboard);

//Add_Rooom
router.get("/room/add",roomCtrl.addrooom)

//Add room to databse
router.post("/rooms/save", roomCtrl.saveRoom);

// View all rooms
router.get("/room/view", roomCtrl.viewRooms);


//Add nurse
router.get("/nurse/add", roomCtrl.addNurse);

// Save nurse to database
router.post("/nurse/save", roomCtrl.saveNurse);

// View all nurses
router.get("/nurse/view", roomCtrl.viewNurses);


//Add patient
router.get("/patient/add", roomCtrl.addPatientForm);

// Save patient to database
router.post("/patient/save", roomCtrl.savePatient);

// View all patients
router.get("/patient/view", roomCtrl.viewPatients);

module.exports = router;