const patientModel = require("../models/patientModel");
const asynchandler = require("express-async-handler");
const moment = require("moment");

// Add patient controller


//render patient form 
exports.loadAppointmentForm = asynchandler(async (req, res) => {

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

    const admitted_date = `${appointment_date} ${appointment_time}`;

    try {
        const result = await patientModel.createPatient(
            patient_name,
            patient_age,
            patient_gender,
            patient_contact,
            patient_issue,
            admitted_date,
            doctor_id
        );

        res.redirect("/reception");
    } catch (err) {
        console.error("Error creating patient:", err);
        res.status(500).send("Internal server error");
    }
};

// View all patients controller
exports.viewPatients = async (req, res) => {
    try {
        const patients = await patientModel.getAllPatients();
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


// Get available slots for a doctor on a specific date
// This function retrieves the available time slots for a doctor on a given date.
exports.getDoctorAvailableSlots = async (req, res) => {
    const doctorId = req.params.doctorId;
    const date = req.query.date;

    if (!doctorId || !date) return res.json([]);

    const start = moment(`${date} 10:00`, "YYYY-MM-DD HH:mm");
    const end = moment(`${date} 16:00`, "YYYY-MM-DD HH:mm");

    try {
        //
        const rows = await patientModel.getBookedSlots(doctorId, date);
        console.log("Booked rows:", rows); // ✅ Add this

        const bookedTimes = rows.map(r =>
            moment(r.admitted_date).format("HH:mm")
        );

        if (bookedTimes.length >= 10) {
            return res.json([]); // Max slots filled
        }
        const available = [];
        console.log("Available times:", available); // ✅ Add this
        // Generate time slots in 30-minute intervals
        // This loop generates time slots in 30-minute intervals between the start and end times.
        let slot = start.clone();
        while (slot.isBefore(end)) {
            const time = slot.format("HH:mm");
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
