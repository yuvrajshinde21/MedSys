// const conn = require("../config/dbConfig");
// const promiseConn = conn.promise();
// exports.getLatestDischargedAdmission = async (patientId) => {
//   const [rows] = await promiseConn.query(`
//     SELECT a.admitted_date, a.discharge_date, a.room_no, r.charges_per_day, a.nurse_id
//     FROM admissions a
//     JOIN rooms r ON a.room_no = r.room_no
//     WHERE a.patient_id = ? AND a.status = 'Discharged'
//     ORDER BY a.admitted_date DESC LIMIT 1
//   `, [patientId]);
//   return rows[0];
// };
// exports.getMedicineCharges = async (patientId) => {
//   const [rows] = await promiseConn.query(`
//     SELECT SUM(m.price * p.quantity) AS total
//     FROM prescriptions p
//     JOIN medicines m ON p.medicine_id = m.medicine_id
//     WHERE p.patient_id = ?
//   `, [patientId]);

//   return rows[0].total || 0; 
// };


// //  Get patient name
// exports.getPatientName = async (patientId) => {
//   const [row] = await promiseConn.query(
//     "SELECT patient_name FROM patients WHERE patient_id = ?",
//     [patientId]
//   );
//   return row;
// };

// //---------
// // Get detailed nurse info
// exports.getNurseDetails = async (nurseId) => {
//   if (!nurseId) return null;
//   const [rows] = await promiseConn.query(`SELECT nurse_name FROM nurses WHERE nurse_id = ?`, [nurseId]);
//   return rows[0];
// };

// // Get detailed medicine breakdown
// exports.getMedicineBreakdown = async (patientId) => {
//   const [rows] = await promiseConn.query(`
//     SELECT m.medicine_name, m.price, p.quantity
//     FROM prescriptions p
//     JOIN medicines m ON p.medicine_id = m.medicine_id
//     WHERE p.patient_id = ?
//   `, [patientId]);
//   return rows;
// };
