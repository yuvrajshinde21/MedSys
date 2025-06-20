const conn = require("../config/dbConfig");
const asyncHandler = require("express-async-handler");
const promiseConn = conn.promise();

//get receptionInfo
exports.getReceptionistInfo = async (receptionistId) => {
  const [rows] = await promiseConn.query(
    "SELECT * FROM reception WHERE user_id = ?",
    [receptionistId]
  );
  return rows[0];
};
//-----------search-----------------------------

exports.searchPatientsByNameOrContact = async (query) => {
  const [rows] = await promiseConn.query(`
    SELECT patient_id, patient_name, patient_contact
    FROM patients
    WHERE patient_name LIKE ? OR patient_contact LIKE ?
    LIMIT 10
  `, [`%${query}%`, `%${query}%`]);
  return rows;
};


//-----------------------------------------------

// Save room to database:
exports.createRoom = asyncHandler(async (room) => {
    // Check if room_no already exists
    const [existingRoom] = await promiseConn.query(
        "SELECT * FROM rooms WHERE room_no = ?",
        [room.room_no]
    );
    if (existingRoom.length > 0) {
        return {message : "Room with this number already exists"};
    }
    const [result] = await promiseConn.query(
        "INSERT INTO rooms (room_no, room_type, room_status, charges_per_day) VALUES (?, ?, ?, ?)",
        [room.room_no, room.room_type, room.room_status, room.charges_per_day]
    );
    return {insertId: result.insertId, message: "Room added successfully"};
});

// View all rooms:
exports.getAllRooms = async () => {
  const [rows] = await promiseConn.query("SELECT * FROM rooms");
  return rows;
};

// Get room by ID:=====================
exports.getRoomTypes = async () => {
  const [rows] = await promiseConn.query("SELECT DISTINCT room_type FROM rooms");
  return rows.map(r => r.room_type);
};

// Get room by id:
exports.getRoomById = async (roomId) => {
    const [rows] = await promiseConn.query("SELECT * FROM rooms WHERE room_no = ?", [roomId]);
    return rows.length > 0 ? rows[0] : null;
};

// Update room information:
exports.updateRoom = async (roomId, roomType, roomStatus, chargesPerDay) => {
  const [result] = await promiseConn.query(
    "UPDATE rooms SET room_type = ?, room_status = ?, charges_per_day = ? WHERE room_no = ?",
    [roomType, roomStatus, chargesPerDay, roomId]
  );
  return result.affectedRows > 0;
};

// Delete room:
exports.deleteRoom = async (roomId) => {
  const [result] = await promiseConn.query("DELETE FROM rooms WHERE room_no = ?", [roomId]);
  return result.affectedRows > 0;
};

//--------------------------generate Bill--------------------------------
const pool = require('../config/dbConfig');

// Patient
exports.getPatientById = async (id) => {
  const [rows] = await conn.query("SELECT * FROM patients WHERE patient_id = ?", [id]);
  return rows[0];
};

// Appointment
exports.getLatestAppointmentByPatient = async (patientId) => {
  const [rows] = await conn.query(
    `SELECT * FROM appointments 
     WHERE patient_id = ? ORDER BY appointment_date DESC LIMIT 1`, 
    [patientId]
  );
  return rows[0];
};

// Doctor
exports.getDoctorById = async (doctorId) => {
  const [rows] = await conn.query("SELECT * FROM doctor WHERE doctor_id = ?", [doctorId]);
  return rows[0];
};

// Admission
exports.getAdmissionByAppointmentId = async (appointmentId) => {
  const [rows] = await conn.query(
    "SELECT * FROM admissions WHERE appointment_id = ? LIMIT 1", 
    [appointmentId]
  );
  return rows[0];
};

// Room
exports.getRoomByNo = async (roomNo) => {
  const [rows] = await conn.query("SELECT * FROM rooms WHERE room_no = ?", [roomNo]);
  return rows[0];
};

// Nurse
exports.getNurseById = async (nurseId) => {
  const [rows] = await conn.query("SELECT * FROM nurses WHERE nurse_id = ?", [nurseId]);
  return rows[0];
};

// Prescriptions
exports.getPrescriptionsByPatientId = async (patientId) => {
  const [rows] = await conn.query(
    `SELECT p.quantity, p.dosage, p.frequency, m.medicine_name, m.price
     FROM prescriptions p
     JOIN medicines m ON p.medicine_id = m.medicine_id
     WHERE p.patient_id = ?`,
    [patientId]
  );
  return rows;
};

//get all admited patients
exports.getAdmittedPatients = async () => {
  const [rows] = await promiseConn.query(`
  SELECT a.*, p.patient_name, p.patient_age, p.patient_gender, p.patient_contact,
         d.doctor_name,
         r.room_type, 
         n.nurse_name, n.nurse_shift
  FROM admissions a
  JOIN patients p ON a.patient_id = p.patient_id
  JOIN doctor d ON a.doctor_id = d.doctor_id
  LEFT JOIN rooms r ON a.room_no = r.room_no
  LEFT JOIN nurses n ON a.nurse_id = n.nurse_id
  WHERE a.status = 'Admitted'
`);

  return rows;
};

//assign room
exports.assignRoom = async (admissionId, newRoomNo) => {
    const conn = await promiseConn.getConnection();
    try {
        await conn.beginTransaction();

        // check new room is available
        const [roomRows] = await conn.query(
            `SELECT room_status FROM rooms WHERE room_no = ? AND room_status = 'Available'`,
            [newRoomNo]
        );
        if (roomRows.length === 0) {
            await conn.rollback();
            return false;
        }

        // get priviously assigned room if assigned
        const [admissionRows] = await conn.query(
            `SELECT room_no FROM admissions WHERE admission_id = ?`,
            [admissionId]
        );

        const oldRoomNo = admissionRows[0]?.room_no;

        //mark old room available if exists and different from old 
        if (oldRoomNo && oldRoomNo !== newRoomNo) {
            await conn.query(
                `UPDATE rooms SET room_status = 'Available' WHERE room_no = ?`,
                [oldRoomNo]
            );
        }

        // mark new room occupied
        await conn.query(
            `UPDATE rooms SET room_status = 'Occupied' WHERE room_no = ?`,
            [newRoomNo]
        );

        //update admission with new room
        await conn.query(
            `UPDATE admissions SET room_no = ? WHERE admission_id = ?`,
            [newRoomNo, admissionId]
        );

        await conn.commit();
        return true;
    } catch (err) {
        await conn.rollback();
        console.error("Room assignment error:", err);
        return false;
    } finally {
        conn.release();
    }
};


//get available rooms
exports.getAvailableRooms = async () => {
  try {
    const [rows] = await promiseConn.query(
      `SELECT room_no, room_type, charges_per_day 
       FROM rooms 
       WHERE room_status = 'Available'`
    );
    return rows;
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    return [];
  }
};
//get available nurses
exports.getAvailableNurses = async () => {
  try {
    const [rows] = await promiseConn.query(
      `SELECT nurse_id, nurse_name, nurse_shift 
       FROM nurses `
    );
    return rows;
  } catch (error) {
    console.error("Error fetching available nurses:", error);
    return [];
  }
};


//update room status
exports.updateRoomStatus = async (roomNo, status) => {
  const [result] = await promiseConn.query(
    `UPDATE rooms SET room_status = ? WHERE room_no = ?`,
    [status, roomNo]
  );
  return result.affectedRows > 0;
};
//assign nurse to patient
exports.assignNurseToPatient = async (admissionId, nurseId) => {
  const [result] = await promiseConn.query(
    `UPDATE admissions SET nurse_id = ? WHERE admission_id = ?`,
    [nurseId, admissionId]
  );
  return result.affectedRows > 0;
};
