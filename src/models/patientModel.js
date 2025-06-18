const conn = require("../config/dbConfig");
const promiseConn = conn.promise();

// Save patient to database
// exports.savePatient = async (patient) => {
//   const [result] = await promiseConn.query(
//     `INSERT INTO patient 
//     (patient_name, patient_age, patient_gender, patient_contact, patient_issue, admitted_date, discharge_date, room_no, nurse_id, doctor_id, status)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//       patient.patient_name,
//       patient.patient_age,
//       patient.patient_gender,
//       patient.patient_contact,
//       patient.patient_issue,
//       patient.admitted_date,
//       patient.discharge_date,==
//       patient.room_no,==
//       patient.nurse_id,==
//       patient.doctor_id,
//       patient.status,==
//     ]
//   );
//   return result.insertId;
// };

// View all patients
exports.getAllPatients = async () => {
    const [rows] = await promiseConn.query("select * from patient");
    return rows;
};



// //===============================================================================================================

// // get available rooms
// exports.getAvailableRooms = async () => {
//   const [rows] = await promiseConn.query(
//     "SELECT room_no, room_type FROM room WHERE room_status = 'Available'"
//   );
//   return rows;
// }

// //get all nurses
// exports.getAllNurses = async () => {
//   const [rows] = await promiseConn.query("SELECT nurse_id, nurse_name FROM nurse");
//   return rows;
// }

// get spelizations
exports.getAllSpecializations = async () => {
    const [rows] = await promiseConn.query("SELECT * FROM specializations");
    return rows;
}

//get doctors by specialization 
exports.getDoctorsBySpecialization = async (specializationId) => {
    const [rows] = await promiseConn.query(
        "SELECT doctor_id, doctor_name FROM doctor WHERE doctor_specialization = ? AND is_deleted = 0",
        [specializationId]
    );
    return rows;
};

//insert patient
exports.createPatient = async (patient_name, patient_age, patient_gender, patient_contact,
    patient_issue, admitted_date, doctor_id) => {
    const [rows] = await promiseConn.query(`
      INSERT INTO patient (
        patient_name, patient_age, patient_gender, patient_contact,
        patient_issue, admitted_date, doctor_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Scheduled')
    `, [
        patient_name, patient_age, patient_gender, patient_contact,
        patient_issue, admitted_date, doctor_id
    ]);
    return rows.insertId;
};

//get booked slots by doctor id
exports.getBookedSlots = async (doctorId, appointmentDate) => {
    const [rows] = await promiseConn.query(
        `SELECT admitted_date FROM patient 
       WHERE doctor_id = ? AND DATE(admitted_date) = ?`,
        [doctorId, appointmentDate]
    );
    return rows;
};