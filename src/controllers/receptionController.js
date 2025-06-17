//Room_ Controller
let Room = require("../models/receptionModel"); 

const receptionService = require("../service/receptionService");

exports.showReceptionDashboard =async (req, res) => {
    //get receptionist info 
    const receptionistId = req.user.user_id; 
    const receptionistInfo = await Room.getReceptionistInfo(receptionistId);
    res.render("reception/receptionDashboard.ejs", {
        main_content: "receptionistInfo",
        receptionist: receptionistInfo,
        title: "Reception Dashboard",
        message: "Welcome to the Reception Dashboard",
    });
};

//add room controller
exports.addRoom = (req, res) => {
    res.render("reception/receptionDashboard.ejs", {
        main_content: "addRoom",
        title: "Add Room",
        message: "Add a new room to the hospital.",
    });
};  


//Save room controller
exports.saveRoom = async (req, res) => {
    try {
        const room = {
            room_no: req.body.room_no,
            room_type: req.body.room_type,
            room_status: req.body.room_status,
            charges_per_day: req.body.charges_per_day
        };

        const roomId = await Room.saveRoom(room);
        console.log("Room saved with ID:", roomId);
        res.redirect("/reception");
    } catch (err) {
        console.error("Error saving room:", err);
        res.status(500).send("Error saving room");
    }
};

//View all rooms controller
exports.viewRooms = async (req, res) => {
    try {
        const rooms = await Room.getAllRooms();
        res.render("reception/receptionDashboard.ejs", {
            main_content: "viewRooms",
            title: "View Rooms",
            rooms: rooms,
        });
    } catch (err) {
        console.error("Error fetching rooms:", err);
        res.status(500).send("Error fetching rooms");
    }
};

//
exports.getRoomById = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.getRoomById(roomId);
    if (!room) {
      return res.status(404).send("Room not found");
    }

    const roomTypes = await Room.getRoomTypes();

    res.render("reception/receptionDashboard.ejs", {
      main_content: "editRoom",
      title: "Edit Room",
      room: room,
      roomTypes: roomTypes   
    });
  } catch (err) {
    console.error("Error fetching room:", err);
    res.status(500).send("Error fetching room");
  }
};

//Update room status controller
exports.updateRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { room_type, room_status, charges_per_day } = req.body;

    await Room.updateRoom(roomId, room_type, room_status, charges_per_day);

    console.log(`Room ${roomId} updated successfully`);
    res.redirect("/reception");
  } catch (err) {
    console.error("Error updating room:", err);
    res.status(500).send("Error updating room");
  }
};

//Delete room controller
exports.deleteRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const result = await Room.deleteRoom(roomId);
        console.log(result);
        
        if (result) {
            console.log(`Room ${roomId} deleted successfully`);
            res.redirect("/reception/rooms");
        } else {
            res.status(404).send("Room not found");
        }
    } catch (err) {
        console.error("Error deleting room:", err);
        res.status(500).send("Error deleting room");
    }
};

//Add nurse controller
exports.addNurse = (req, res) => {
    res.render("reception/receptionDashboard.ejs", {
        main_content: "addNurse",
        title: "Add Nurse",
        message: "Add a new nurse to the hospital.",
    });
};

// Save nurse to database   
exports.saveNurse = async (req, res) => {
    try {
        const nurse = {
            nurse_name: req.body.nurse_name,
            nurse_contact: req.body.nurse_contact,
            nurse_shift: req.body.nurse_shift
        };

        const result = await Room.saveNurse(nurse);
        console.log("Nurse saved with ID:", result);
        res.redirect("/reception");
    } catch (err) {
        console.error("Error saving nurse:", err);
        res.status(500).send("Error saving nurse");
    }
};

// View all nurses controller
exports.    viewNurses = async (req, res) => {
    try {
        const nurses = await Room.getAllNurses();
        res.render("reception/receptionDashboard.ejs", {
            main_content: "viewNurses",
            title: "View Nurses",
            nurses: nurses,
        });
    } catch (err) {
        console.error("Error fetching nurses:", err);
        res.status(500).send("Error fetching nurses");
    }
};

// Get nurse by ID controller
exports.getNurseById = async (req, res) => {
  try {
    const nurseId = req.params.nurseId;
    const nurse = await Room.getNurseById(nurseId);
    if (!nurse) {
      return res.status(404).send("Nurse not found");
    }

    res.render("reception/receptionDashboard.ejs", {
      main_content: "editNurse",
      title: "Edit Nurse",
      nurse: nurse
    });
  } catch (err) {
    console.error("Error fetching nurse:", err);
    res.status(500).send("Error fetching nurse");
  }
};

// Update nurse controller
exports.updateNurse = async (req, res) => {
  try {
    const nurseId = req.params.nurseId;
    const { nurse_name, nurse_contact, nurse_shift } = req.body;

    await Room.updateNurse(nurseId, nurse_name, nurse_contact, nurse_shift);

    console.log(`Nurse ${nurseId} updated successfully`);
    res.redirect("/reception");
  } catch (err) {
    console.error("Error updating nurse:", err);
    res.status(500).send("Error updating nurse");
  }
};  

// Delete nurse controller
exports.deleteNurse = async (req, res) => {
    try {
        const nurseId = req.params.nurseId;
        const result = await Room.deleteNurse(nurseId);
        
        if (result) {
            console.log(`Nurse ${nurseId} deleted successfully`);
            res.redirect("/reception/nurses");
        } else {
            res.status(404).send("Nurse not found");
        }
    } catch (err) {
        console.error("Error deleting nurse:", err);
        res.status(500).send("Error deleting nurse");
    }
};


// Add patient controller
const promiseConn = require("../config/dbConfig").promise();

//get patient form data
exports.addPatientForm = async (req, res) => {
  try {
    const [rooms] = await promiseConn.query("SELECT room_no, room_type FROM room WHERE room_status = 'Available'");
    const [nurses] = await promiseConn.query("SELECT nurse_id, nurse_name FROM nurse");
    const [doctors] = await promiseConn.query("SELECT doctor_id, doctor_name FROM doctor");

    res.render("reception/receptionDashboard.ejs", {
        main_content: "addPatient",
      title: "Add Patient",
      rooms,
      nurses,
      doctors,
       currentDate: receptionService.getCurrentDate(), // Get current date for the form
    });
  } catch (err) {
    console.error("Error loading patient form data:", err);
    res.status(500).send("Error loading form");
  }
};

// Save patient to database
exports.savePatient = async (req, res) => {
  try {
    const patient = {
      patient_name: req.body.patient_name,
      patient_age: req.body.patient_age,
      patient_gender: req.body.patient_gender,
      patient_contact: req.body.patient_contact,
      patient_issue: req.body.patient_issue,
      admitted_date: receptionService.getCurrentDate(),  // Set current date
      discharge_date: req.body.discharge_date || null,
      room_no: req.body.room_no,
      nurse_id: req.body.nurse_id,
      doctor_id: req.body.doctor_id,
      status: req.body.status
    };

    const result = await Room.savePatient(patient);
    console.log("Patient saved with ID:", result);
    res.redirect("/reception");
  } catch (err) {
    console.error("Error saving patient:", err);
    res.status(500).send("Error saving patient");
  }
};

// View all patients controller
exports.viewPatients = async (req, res) => {
    try {
        const patients = await Room.getAllPatients();
        res.render("reception/receptionDashboard.ejs", {
            main_content: "viewPatients",
            title: "View Patients",
            patients: patients,
        });
    } catch (err) {
        console.error("Error fetching patients:", err);
        res.status(500).send("Error fetching patients");
    }
};