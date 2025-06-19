const conn = require("../config/dbConfig");
const promiseConn = conn.promise();

const asynchandler = require("express-async-handler");
// Get doctor ID by user ID
exports.getDoctorIdByUserId = async (userId) => {
    const [rows] = await promiseConn.query(
        "SELECT doctor_id FROM doctor WHERE user_id = ?",
        [userId]
    );
    return rows[0]?.doctor_id;
};

//get scheduled appointments
exports.getScheduledAppointments = async (doctorId) => {
    const [rows] = await promiseConn.execute(
        `SELECT 
            a.appointment_id, a.appointment_date, a.status, a.patient_issue,
            p.patient_id, p.patient_name, p.patient_age, p.patient_gender, p.patient_contact
         FROM appointments a
         JOIN patients p ON a.patient_id = p.patient_id
         WHERE a.doctor_id = ? AND a.status = 'Scheduled'
         ORDER BY a.appointment_date ASC`,
        [doctorId]
    );
    return rows;
};

// get specific appoiment by appoiment id
exports.getScheduledAppointmentByID = async (appointmentId) => {
    const [rows] = await promiseConn.execute("SELECT a.*,p.patient_id, p.patient_name, p.patient_age, p.patient_gender ,p.patient_id ,p.patient_contact FROM appointments a JOIN patients p ON a.patient_id = p.patient_id WHERE a.appointment_id = ?", [appointmentId]);
    return rows[0];
}

//get medicines
exports.getMedicines = async () => {
    const [rows] = await promiseConn.query("select * from medicines");
    return rows;
}

//get privious prisptions 
// Get previous prescriptions (excluding current appointment)
exports.getPriviousPrescriptions = async (patientId, currentAppointmentId) => {
  const [rows] = await promiseConn.execute(`
    SELECT 
      p.appointment_id,
      a.appointment_date AS prescription_date,
      m.medicine_name,
      p.dosage,
      p.frequency,
      p.quantity
    FROM prescriptions p
    JOIN appointments a ON p.appointment_id = a.appointment_id
    JOIN medicines m ON p.medicine_id = m.medicine_id
    WHERE p.patient_id = ? 
      AND p.appointment_id != ?
    ORDER BY a.appointment_date DESC
  `, [patientId, currentAppointmentId]);

  // Group by appointment_id
  const grouped = {};

  for (const row of rows) {
    const id = row.appointment_id;
    if (!grouped[id]) {
      grouped[id] = {
        prescription_date: row.prescription_date,
        medicines: []
      };
    }

    grouped[id].medicines.push({
      medicine_name: row.medicine_name,
      dosage: row.dosage,
      frequency: row.frequency,
      quantity: row.quantity
    });
  }

  // Convert grouped object to array
  return Object.values(grouped);
};



//Mark Appointment as Completed
exports.markStatusCompleted = asynchandler(async (appointment_id, patient_id, status) => {
    const [result] = await promiseConn.query(
        `UPDATE appointments
     SET status = ?
     WHERE appointment_id = ? AND patient_id = ?`,
        [status, appointment_id, patient_id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Failed to update status of appointment.");
    }
});

// Insert a Prescription Entry
exports.insertPrescription = asynchandler(async (appointment_id, medicine_id, quantity, dosage, frequency,patient_id) => {
    const [result] = await promiseConn.query(
        `INSERT INTO prescriptions
     (appointment_id, medicine_id, quantity, dosage, frequency,patient_id)
     VALUES (?, ?, ?, ?, ?,?)`,
        [appointment_id, medicine_id, quantity, dosage, frequency,patient_id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Failed to insert Prescription.");
    }
});


// Admit Patient
exports.admitPatient = asynchandler(async (patient_id, doctor_id, admitted_datetime, status, icu_required,appointment_id) => {
    const [result] = await promiseConn.query(
        `INSERT INTO admissions
     (patient_id, doctor_id, admitted_date, status, icu_required)
     VALUES (?, ?, ?, ?, ?,?)`,
        [patient_id, doctor_id, admitted_datetime, status, icu_required,appointment_id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Failed to Admit patient.");
    }
});

// Get admitted patients for a specific doctor
exports.fetchAdmittedPatientsOfDoctor = async (doctor_id) => {
  const [rows] = await promiseConn.query(`
    SELECT 
  a.admission_id,
  a.patient_id ,
  a.doctor_id ,
  a.nurse_id,
  a.room_no,
  a.admitted_date,
  a.discharge_date,
  a.status AS admission_status,
  a.icu_required,
  a.appointment_id AS admitted_appointment_id,
  p.patient_id,
  p.patient_name,
  p.patient_age,
  p.patient_gender,
  p.patient_contact,
  ap.appointment_id,
  ap.patient_issue,
  ap.appointment_date,
  ap.status AS appointment_status
FROM admissions a
JOIN patients p ON a.patient_id = p.patient_id
LEFT JOIN appointments ap ON a.appointment_id = ap.appointment_id
WHERE a.doctor_id = ?
  AND a.status = 'Admitted'
ORDER BY a.admitted_date DESC
  `, [doctor_id]);

  return rows;
};





// Get admission details by admission_id
exports.getAdmissionDetails = async (admissionId) => {
  const [rows] = await promiseConn.execute(`
    SELECT 
      a.admission_id,
      a.patient_id,
      a.doctor_id,
      a.admitted_date,
      a.icu_required,
      p.patient_name,
      p.patient_age,
      p.patient_gender,
      p.patient_contact
    FROM admissions a
    JOIN patients p ON a.patient_id = p.patient_id
    WHERE a.admission_id = ?
  `, [admissionId]);

  return rows[0]; // Return single admission record
};
