const doctorModel = require("../models/doctorModel");
const asynchandler = require("express-async-handler");
//get appoiments
exports.getScheduledAppointments = asynchandler(async (req, res) => {
    const doctorId = req.user.doctorId;
    const scheduledAppointments = await doctorModel.getScheduledAppointments(
        doctorId
    );
    res.render("doctor/doctorDashboard.ejs", {
        main_content: "appointmentsList",
        appointments: scheduledAppointments,
    });
});

//@desc show priscption from
//@method  get  '/appointments/prescribe/:appointmentId'
exports.showPrescriptionForm = async (req, res) => {
    const appointmentId = req.params.appointmentId;

    const appoiment = await doctorModel.getScheduledAppointmentByID(
        appointmentId
    );
    const patientId = appoiment.patient_id;
    const medicines = await doctorModel.getMedicines();
    console.log('Fetching previous prescriptions for', patientId, 'excluding', appointmentId);

    const prescriptions = await doctorModel.getPriviousPrescriptions(patientId, appointmentId)
    console.log("Previous Prescriptions:", prescriptions);

    res.render("doctor/doctorDashboard", {
        main_content: "prescribe_form",
        appointment: appoiment,
        medicines: medicines,
        previousPrescriptions: prescriptions
    });


};

//@ create preception deside addmition
//@Route post '/appointments/prescribe/:appointmentId'
exports.createPrescriptionAndAdmissions = asynchandler(async (req, res) => {
    const appointment_id = req.body.appointment_id;
    const patient_id = req.body.patient_id;
    const doctor_id = req.body.doctor_id;
    const medicine_id = req.body.medicine_id;
    const dosage = req.body.dosage;
    const frequency = req.body.frequency;
    const quantity = req.body.quantity;
    const action = req.body.next_action;

    const icu_required = req.body.icu_required ? 1 : 0;
    const admitted_date = new Date();

    //remove medicine valid / not enpty medicines
    const validMedicines = medicine_id.map((id, i) => {
        return {
            medicine_id: id,
            quantity: quantity[i],
            dosage: dosage[i],
            frequency: frequency[i]
        }
    }).filter(med => med.medicine_id && med.quantity && med.dosage && med.frequency)

    //insert  status 'Completed' into appointments
    await doctorModel.markStatusCompleted(appointment_id, patient_id, 'Completed')
    //insert prsicptions
    for (let medicine of validMedicines) {
        await doctorModel.insertPrescription(appointment_id, medicine.medicine_id, medicine.quantity, medicine.dosage, medicine.frequency, patient_id);
    }
    //if admited
    if (action === 'Admitted') {
        await doctorModel.admitPatient(patient_id, doctor_id, admitted_date, action, icu_required,appointment_id);
    }
    res.redirect('/doctor/appointments/scheduled');

})

// @desc    Get Admitted Patients for the Logged-in Doctor
// @route   GET /doctor/admitted
exports.getAdmittedPatientsOfDoctor = asynchandler(async (req, res) => {
    const doctorid = req.user.doctorId;

    const admittedPatientsData = await doctorModel.fetchAdmittedPatientsOfDoctor(doctorid);
console.log(admittedPatientsData);
    res.render('doctor/doctorDashboard', {
        main_content: 'admittedPatients',
        admittedPatientsData : admittedPatientsData
    });
});


//for admited===================================================
// controller/doctorController.js
//show admited patient preception form
exports.showAdmittedPrescriptionForm = async (req, res) => {
    const admissionId = req.params.admissionId;
    const admissionDetails = await doctorModel.getAdmissionDetails(admissionId);
    const medicines = await doctorModel.getMedicines();
    const previousPrescriptions = await doctorModel.getPriviousPrescriptions(admissionDetails.patient_id, null);
    res.render('doctor/doctorDashboard', {
        main_content: 'admitted_prescribe_form',
        admission: admissionDetails,
        medicines,
        previousPrescriptions
    });
    //     const appointmentId = req.params.appointmentId;

    // const appoiment = await doctorModel.getScheduledAppointmentByID(
    //     appointmentId
    // );
    // const patientId = appoiment.patient_id;
    // const medicines = await doctorModel.getMedicines();
    // console.log('Fetching previous prescriptions for', patientId, 'excluding', appointmentId);

    // const prescriptions = await doctorModel.getPriviousPrescriptions(patientId, appointmentId)
    // console.log("Previous Prescriptions:", prescriptions);

    // res.render("doctor/doctorDashboard", {
    //     main_content: "prescribe_form",
    //     appointment: appoiment,
    //     medicines: medicines,
    //     previousPrescriptions: prescriptions
    // });
};

exports.createAdmittedPrescription = async (req, res) => {
  try {
    const admission_id = req.params.admissionId;
    const { patient_id, doctor_id, medicine_id, dosage, frequency, quantity } = req.body;

    // Filter valid medicines
    const validMedicines = medicine_id.map((id, i) => ({
      medicine_id: id,
      dosage: dosage[i],
      frequency: frequency[i],
      quantity: quantity[i]
    })).filter(m => m.medicine_id && m.dosage && m.frequency && m.quantity);

    // Insert prescriptions (no appointment_id since this is for admitted patients)
    for (const med of validMedicines) {
      await doctorModel.insertPrescription(
        null, //appoiment_id
        med.medicine_id,
        med.quantity,
        med.dosage,
        med.frequency,
        patient_id
      );
    }

    // Redirect back to admitted patients list
    res.redirect("/doctor/admitted-patients");
  } catch (err) {
    console.error("Error prescribing for admitted patient:", err.message);
    res.status(500).send("Internal Server Error");
  }
};

