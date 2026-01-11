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
    // console.log("Previous Prescriptions:", prescriptions);

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
        await doctorModel.admitPatient(patient_id, doctor_id, admitted_date, action, icu_required, appointment_id);
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
        admittedPatientsData: admittedPatientsData
    });
});

//show admited patient preception form
exports.showAdmittedPatientPrescriptionForm = asynchandler(async (req, res) => {

    const admissionId = req.params.admissionId;

    //get admission details
    const admission = await doctorModel.getAdmissionDetails(admissionId);

    const appointmentId = admission.appointment_id;
    const patientId = admission.patient_id;

    //get medicines
    const medicines = await doctorModel.getMedicines();
    //fetch privious priscption skip current
    const previousPrescriptions = await doctorModel.getPriviousPrescriptions(patientId, appointmentId);

    res.render("doctor/doctorDashboard", {
        main_content: "admitted_prescribe_form",
        admission,
        appointmentId,
        medicines,
        previousPrescriptions
    });
});

//create precption for admited patient
// @desc Create prescription for an admitted patient
// @route POST /doctor/admitted-patients/prescribe/:admissionId
exports.createAdmittedPrescription = asynchandler(async (req, res) => {
    const admissionId = req.params.admissionId;
    const { patient_id, doctor_id, medicine_id, dosage, frequency, quantity } = req.body;
    // 1. Get the appointment_id linked to this admission
    const result = await doctorModel.getAppoimentIdFromAdmission(admissionId)

    if (result.length === 0) {
        throw new Error("Admission record not found");
    }
    const appointmentId = result[0].appointment_id;

    const validMedicines = medicine_id.map((id, i) => {
        return {
            medicine_id: id,
            quantity: quantity[i],
            dosage: dosage[i],
            frequency: frequency[i]
        }
    }).filter(med => med.medicine_id && med.quantity && med.frequency && med.dosage);

    // 2. Insert prescriptions
    for (let medicine of validMedicines) {
        await doctorModel.insertPrescription(appointmentId, medicine.medicine_id, medicine.quantity, medicine.dosage, medicine.frequency, patient_id);
    }

    // 3. Optionally mark appointment status as 'Completed'
    // {
    //   patient_id: '3',
    //   doctor_id: '10',
    //   medicine_id: [ '10' ],
    //   dosage: [ '100 mg' ],
    //   frequency: [ 'Twice Daily' ],
    //   quantity: [ '2' ]
    // }

    res.redirect("/doctor/admitted-patients"); 

});

//discharge
exports.dischargePatient = async (req, res) => {
  try {
    const admissionId = req.params.id;

    const success = await doctorModel.markAsDischarged(admissionId);

    if (success) {
      req.flash('successMessage', 'Patient discharged successfully and room marked as available.');
    } else {
      req.flash('errorMessage', 'Discharge failed.');
    }
  } catch (error) {
    console.error("Discharge error:", error);
    req.flash('errorMessage', 'An error occurred while discharging the patient.');
  }

  res.redirect('/doctor/admitted-patients');
};

