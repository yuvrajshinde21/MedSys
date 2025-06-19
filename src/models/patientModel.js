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
exports.fetchBasicPatients = async () => {
  const [rows] = await promiseConn.query(`
    SELECT 
      p.patient_id,
      p.patient_name,
      p.patient_age,
      p.patient_gender,
      p.patient_contact,

      -- Most recent appointment status
      (
        SELECT status 
        FROM appointments 
        WHERE appointments.patient_id = p.patient_id 
        ORDER BY appointment_date DESC 
        LIMIT 1
      ) AS appointment_status,

      -- Most recent admission status
      (
        SELECT status 
        FROM admissions 
        WHERE admissions.patient_id = p.patient_id 
        ORDER BY admitted_date DESC 
        LIMIT 1
      ) AS admission_status

    FROM patients p
    ORDER BY p.patient_id DESC
  `);

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

//insert patient===
exports.createPatient = async (name, age, gender, contact) => {
    return await promiseConn.query(
        `INSERT INTO patients 
        (patient_name, patient_age, patient_gender, patient_contact)
        VALUES (?, ?, ?, ?)`,
        [name, age, gender, contact]
    );
};
//create appointment
exports.createAppointment = async (patient_id, doctor_id, appointment_datetime, issue) => {
    return await promiseConn.query(
        `INSERT INTO appointments 
        (patient_id, doctor_id, appointment_date, patient_issue,status)
        VALUES (?, ?, ?, ?,'Scheduled')`,
        [patient_id, doctor_id, appointment_datetime,issue]
    );
};
//===


//get booked slots by doctor id
exports.getBookedSlots = async (doctorId, appointmentDate) => {
    const [rows] = await promiseConn.query(
        `SELECT appointment_date FROM appointments 
         WHERE doctor_id = ? AND DATE(appointment_date) = ? 
         AND status = 'Scheduled'`,
        [doctorId, appointmentDate]
    );
    return rows;
};
