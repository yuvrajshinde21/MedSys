
// const billingModel = require("../models/billingModel");

// exports.getBillPreview = async (req, res) => {
//   const patientId = req.params.patient_id;

//   try {
//     const admission = await billingModel.getLatestDischargedAdmission(patientId);
//     const admittedDate = admission ? new Date(admission.admitted_date) : null;
//     const dischargedDate = admission ? new Date(admission.discharge_date) : null;
//     const stayDays = admittedDate && dischargedDate
//       ? Math.max(1, Math.ceil((dischargedDate - admittedDate) / (1000 * 60 * 60 * 24)))
//       : 0;

//     const roomCharges = stayDays * (admission?.charges_per_day || 0);
//     const nurseCharges = admission?.nurse_id ? stayDays * 500 : 0;
//     const medicineCharges = parseFloat(await billingModel.getMedicineCharges(patientId)) || 0;
//     const treatmentCharges = 1000;
//     const totalAmount = roomCharges + nurseCharges + medicineCharges + treatmentCharges;

//     const [patientRow] = await billingModel.getPatientName(patientId);
//     const patient_name = patientRow?.patient_name || "Unknown";

//     const billing_date = new Date();

//     // 🔽 Get breakdowns
//     const nurseDetail = await billingModel.getNurseDetails(admission?.nurse_id);
//     const medicineBreakdown = await billingModel.getMedicineBreakdown(patientId);

//     res.render("reception/receptionDashboard", {
//   main_content: "bill_preview",
//   patientId,
//   patient_name,
//   billing_date,
//   roomCharges,
//   nurseCharges,
//   treatmentCharges,
//   medicineCharges,
//   totalAmount,
//   admission,           // <-- ADD THIS
//   stayDays,            // <-- AND THIS
//   nurseDetail,         // Optional, if you're showing nurse name
//   medicineBreakdown    // Optional, if showing medicine details
// });

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error generating bill preview");
//   }
// };
