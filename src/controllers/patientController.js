const moment = require("moment");

const patientModel = require("../models/patientModel");
const asyncHandler = require("express-async-handler");
const receptionModel = require("../models/receptionModel");
// Add patient controller


//render patient form 
exports.loadAppointmentForm = asyncHandler(async (req, res) => {

    // const rooms = await patientModel.getAvailableRooms();
    // const nurses = await patientModel.getAllNurses();
    const specializations = await patientModel.getAllSpecializations();
    res.render("reception/receptionDashboard.ejs", {
        main_content: "addPatient",
        title: "Add Patient",
        specializations: specializations
    });

});

exports.getDoctorsBySpecialization = async (req, res) => {
    const specializationId = req.params.id;
    try {
        const doctors = await patientModel.getDoctorsBySpecialization(specializationId);
        res.json(doctors);
    } catch (err) {
        console.error("Error fetching doctors:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
// ==========
// Save patient to database
exports.createPatientAppointment = async (req, res) => {
    const patient_name = req.body.patient_name.trim();
    const patient_age = req.body.patient_age.trim();
    const patient_gender = req.body.patient_gender.trim();
    const patient_contact = req.body.patient_contact.trim();
    const patient_issue = req.body.patient_issue.trim();
    const doctor_id = req.body.doctor_id.trim();
    const appointment_date = req.body.appointment_date.trim();
    const appointment_time = req.body.appointment_time.trim();

    if (!patient_name || !patient_age || !patient_contact || !patient_gender || !patient_issue || !doctor_id || !appointment_date || !appointment_time) {
        throw new Error("All fields are required!");//===render err message later

    }

    const appointment_datetime = `${appointment_date} ${appointment_time}:00`;

    try {
        // 1. Insert patient
        const [patientResult] = await patientModel.createPatient(
            patient_name,
            patient_age,
            patient_gender,
            patient_contact
        );
        const patient_id = patientResult.insertId;

        // 2. Insert appointment
        await patientModel.createAppointment(
            patient_id,
            doctor_id,
            appointment_datetime,
            patient_issue
        );

        res.redirect("/reception");
    } catch (err) {
        console.error("Error creating patient appointment:", err);
        res.status(500).send("Internal server error");
    }
};


exports.getAllPatients = asyncHandler(async (req, res) => {
    const patients = await patientModel.fetchBasicPatients();
    res.render("reception/receptionDashboard.ejs", {
        main_content: "viewPatients",
        title: "View Patients",
        patients,
    });

});

// Get available slots for a doctor on a specific date
// This function retrieves the available time slots for a doctor on a given date.

exports.getDoctorAvailableSlots = async (req, res) => {
    const doctorId = req.params.doctorId;
    const date = req.query.date;

    if (!doctorId || !date) return res.json([]);

    const start = moment(`${date} 10:00`, "YYYY-MM-DD HH:mm");
    const end = moment(`${date} 16:00`, "YYYY-MM-DD HH:mm");
    const now = moment();

    try {
        const rows = await patientModel.getBookedSlots(doctorId, date);
        const bookedTimes = rows.map(r =>
            moment(r.appointment_date).format("HH:mm")
        );

        if (bookedTimes.length >= 10) {
            return res.json([]);
        }

        const available = [];

        let slot = start.clone();
        while (slot.isBefore(end)) {
            const time = slot.format("HH:mm");

            if (moment(date).isSame(moment(), 'day') && slot.isBefore(now)) {
                slot.add(30, "minutes");
                continue;
            }

            if (!bookedTimes.includes(time)) {
                available.push(time);
            }
            slot.add(30, "minutes");
        }

        res.json(available);
    } catch (err) {
        console.error("Error fetching slots:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// //get patient full detals
// exports.viewPatientDetails = asyncHandler(async (req, res) => {
//   const patientId = req.params.patientId;

//   const patientDetails = await patientModel.getFullPatientDetails(patientId);

//   res.render("reception/receptionDashboard", {
//     main_content: "patient_full_details",
//     title: "Patient Details",
//     patient: patientDetails
//   });
// });

//get patient full detals
exports.viewPatientDetails = asyncHandler(async (req, res) => {
    const patientId = req.params.patientId;

    const patientDetails = await patientModel.getFullPatientDetails(patientId);
    const bill = await patientModel.getBillByPatientId(patientId);
    const availableRooms = await receptionModel.getAvailableRooms();
    const availableNurses = await receptionModel.getAvailableNurses();
    res.render("reception/receptionDashboard", {
        main_content: "patient_full_details",
        title: "Patient Details",
        patient: patientDetails,
        bill,
    availableRooms,
    availableNurses
    });
});


// Show Edit Form
exports.renderEditPatientForm = async (req, res) => {
    const patientId = req.params.patient_id;

    try {
        const patient = await patientModel.getPatientById(patientId);
        if (!patient) {
            return res.status(404).send("Patient not found");
        }

        res.render("reception/receptionDashboard", {
            main_content: "edit_patient",
            patient
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading edit form");
    }
};

// Show Edit Form
exports.renderEditPatientForm = async (req, res) => {
    const patientId = req.params.patient_id;

    try {
        const patient = await patientModel.getPatientById(patientId);
        if (!patient) {
            return res.status(404).send("Patient not found");
        }

        res.render("reception/receptionDashboard", {
            main_content: "edit_patient",
            patient
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading edit form");
    }
};

// Handle Update
exports.updatePatientDetails = async (req, res) => {
    const patientId = req.params.patient_id;
    const { patient_name, patient_age, patient_gender, patient_contact } = req.body;

    try {
        await patientModel.updatePatient(patientId, {
            patient_name,
            patient_age,
            patient_gender,
            patient_contact,
        });

        res.redirect("/reception/patients"); // or detailed view
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating patient");
    }
};
//========================================
