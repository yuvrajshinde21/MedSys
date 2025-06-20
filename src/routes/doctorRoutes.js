const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const asyncHandler = require('express-async-handler');


//get scheduled appoiments
router.route("/appointments/scheduled").get(doctorController.getScheduledAppointments);
//show prisption form and create priscption
router.route('/appointments/prescribe/:appointmentId').get(doctorController.showPrescriptionForm).post(doctorController.createPrescriptionAndAdmissions);

//admited
//show admitedd patient for specific doctor
router.route("/admitted-patients").get(doctorController.getAdmittedPatientsOfDoctor);
//show priscption and create [resption]
router.route("/admitted-patients/prescribe/:admissionId").get(doctorController.showAdmittedPatientPrescriptionForm).post( doctorController.createAdmittedPrescription);
//discharge patient

// Route to discharge a patient
router.get('/admitted-patients/discharge/:id', asyncHandler(doctorController.dischargePatient));


// POST /doctor/prescriptions/add
// POST /doctor/admit
// POST /doctor/appointments/mark-visited

module.exports = router;