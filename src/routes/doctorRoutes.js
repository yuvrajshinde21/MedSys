const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");

router.route("/appointments/scheduled").get(doctorController.getScheduledAppointments);

router.get('/appointments/prescribe/:appointmentId', doctorController.showPrescriptionForm);

router.route('/appointments/prescribe/:appointmentId').get(doctorController.showPrescriptionForm).post(doctorController.createPrescriptionAndAdmissions);

//admited
//show admitedd patient for specific doctor
router.route("/admitted-patients").get(doctorController.getAdmittedPatientsOfDoctor);
// routes/doctorRoutes.js
router.get('/admissions/prescribe/admitted-patients/:appointmentId', doctorController.showAdmittedPrescriptionForm);
router.post('/admissions/prescribe/:admissionId', doctorController.createAdmittedPrescription);


// POST /doctor/prescriptions/add
// POST /doctor/admit
// POST /doctor/appointments/mark-visited

module.exports = router;