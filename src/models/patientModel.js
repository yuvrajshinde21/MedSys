const conn = require("../config/dbConfig");
const promiseConn = conn.promise();

// // View all patients
// exports.fetchBasicPatients = async () => {
//   const [rows] = await promiseConn.query(`
//     SELECT 
//       p.patient_id,
//       p.patient_name,
//       p.patient_age,
//       p.patient_gender,
//       p.patient_contact,
//       (
//         SELECT status 
//         FROM appointments 
//         WHERE appointments.patient_id = p.patient_id 
//         ORDER BY appointment_date DESC 
//         LIMIT 1
//       ) AS appointment_status,
//       (
//         SELECT status 
//         FROM admissions 
//         WHERE admissions.patient_id = p.patient_id 
//         ORDER BY admitted_date DESC 
//         LIMIT 1
//       ) AS admission_status

//     FROM patients p
//     ORDER BY p.patient_id DESC
//   `);

//   return rows;
// };
//=================================
exports.fetchBasicPatients = async ({ status, page, limit, search }) => {
  const offset = (page - 1) * limit;
  const params = [];
  let whereClause = `WHERE 1`; 
  let havingClause = '';

  if (search) {
    whereClause += ` AND (p.patient_name LIKE ? OR p.patient_contact LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (status !== 'All') {
    if (['Admitted', 'Discharged'].includes(status)) {
      havingClause = `HAVING admission_status = '${status}'`;
    } else {
      havingClause = `HAVING appointment_status = '${status}' AND (admission_status IS NULL OR admission_status NOT IN ('Admitted', 'Discharged'))`;
    }
  }

  const [patients] = await promiseConn.query(`
    SELECT 
      p.patient_id,
      p.patient_name,
      p.patient_age,
      p.patient_gender,
      p.patient_contact,
      (
        SELECT status 
        FROM appointments 
        WHERE appointments.patient_id = p.patient_id 
        ORDER BY appointment_date DESC 
        LIMIT 1
      ) AS appointment_status,
      (
        SELECT status 
        FROM admissions 
        WHERE admissions.patient_id = p.patient_id 
        ORDER BY admitted_date DESC 
        LIMIT 1
      ) AS admission_status
    FROM patients p
    ${whereClause}
    ${havingClause}
    ORDER BY p.patient_id DESC
    LIMIT ? OFFSET ?
  `, [...params, limit, offset]);

  const [countResult] = await promiseConn.query(`
    SELECT COUNT(*) AS total
    FROM (
      SELECT 
        p.patient_id,
        (
          SELECT status 
          FROM appointments 
          WHERE appointments.patient_id = p.patient_id 
          ORDER BY appointment_date DESC 
          LIMIT 1
        ) AS appointment_status,
        (
          SELECT status 
          FROM admissions 
          WHERE admissions.patient_id = p.patient_id 
          ORDER BY admitted_date DESC 
          LIMIT 1
        ) AS admission_status
      FROM patients p
      ${whereClause}
      ${havingClause}
    ) AS filtered
  `, params);

  return { patients, totalCount: countResult[0].total };
};


exports.getAllSpecializations = async () => {
  const [rows] = await promiseConn.query("SELECT * FROM specializations");
  return rows;
};

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
exports.createAppointment = async (
  patient_id,
  doctor_id,
  appointment_datetime,
  issue
) => {
  return await promiseConn.query(
    `INSERT INTO appointments 
        (patient_id, doctor_id, appointment_date, patient_issue,status)
        VALUES (?, ?, ?, ?,'Scheduled')`,
    [patient_id, doctor_id, appointment_datetime, issue]
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
exports.getFullPatientDetails = async (patientId) => {
  // 1. Patient basic info
  const [patientRows] = await promiseConn.query(
    `
    SELECT patient_id, patient_name, patient_age, patient_gender, patient_contact
    FROM patients
    WHERE patient_id = ?
  `,
    [patientId]
  );

  const patient = patientRows[0];

  if (!patient) return null;

  // 2. Latest appointment
  const [appointmentRows] = await promiseConn.query(
    `
    SELECT 
      a.appointment_id,
      a.appointment_date,
      a.status AS appointment_status,
      a.patient_issue,
      d.doctor_name
    FROM appointments a
    LEFT JOIN doctor d ON a.doctor_id = d.doctor_id
    WHERE a.patient_id = ?
    ORDER BY a.appointment_date DESC
    LIMIT 1
  `,
    [patientId]
  );

  const latestAppointment = appointmentRows[0] || {};

  // 3. Latest admission
  const [admissionRows] = await promiseConn.query(
    `
    SELECT 
      ad.admission_id,
      ad.room_no,
      r.room_type,
      ad.status AS admission_status,
      ad.admitted_date,
      ad.discharge_date,
      ad.icu_required,
      n.nurse_name
    FROM admissions ad
    LEFT JOIN rooms r ON ad.room_no = r.room_no
    LEFT JOIN nurses n ON ad.nurse_id = n.nurse_id
    WHERE ad.patient_id = ?
    ORDER BY ad.admitted_date DESC
    LIMIT 1
  `,
    [patientId]
  );

  const latestAdmission = admissionRows[0] || {};

  // 4. Merge all data
  return {
    ...patient,
    ...latestAppointment,
    ...latestAdmission,
  };
};

//get bill by patient id
exports.getBillByPatientId = async (patientId) => {
  const [rows] = await promiseConn.query(
    `SELECT * FROM bill WHERE patient_id = ? ORDER BY billing_date DESC LIMIT 1`,
    [patientId]
  );
  return rows[0]; // or undefined
};

//get patient by id
exports.getPatientById = async (id) => {
  const [rows] = await promiseConn.query(
    "SELECT * FROM patients WHERE patient_id = ?",
    [id]
  );
  return rows[0];
};
//update patient
exports.updatePatient = async (id, data) => {
  const { patient_name, patient_age, patient_gender, patient_contact } = data;
  await promiseConn.query(
    "UPDATE patients SET patient_name = ?, patient_age = ?, patient_gender = ?, patient_contact = ? WHERE patient_id = ?",
    [patient_name, patient_age, patient_gender, patient_contact, id]
  );
};
