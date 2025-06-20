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

// Save room to database:
exports.createRoom = asyncHandler(async (room) => {
  // Check if room_no already exists
  const [existingRoom] = await promiseConn.query(
    "SELECT * FROM room WHERE room_no = ?",
    [room.room_no]
  );
  if (existingRoom.length > 0) {
    return { message: "Room with this number already exists" };
  }
  const [result] = await promiseConn.query(
    "INSERT INTO room (room_no, room_type, room_status, charges_per_day) VALUES (?, ?, ?, ?)",
    [room.room_no, room.room_type, room.room_status, room.charges_per_day]
  );
  return { insertId: result.insertId, message: "Room added successfully" };
});

// View all rooms:
exports.getAllRooms = async () => {
  const [rows] = await promiseConn.query("SELECT * FROM room");
  return rows;
};

// Get room by ID:=====================
exports.getRoomTypes = async () => {
  const [rows] = await promiseConn.query("SELECT DISTINCT room_type FROM room");
  return rows.map((r) => r.room_type);
};

// Get room by id:
exports.getRoomById = async (roomId) => {
  const [rows] = await promiseConn.query(
    "SELECT * FROM room WHERE room_no = ?",
    [roomId]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Update room information:
exports.updateRoom = async (roomId, roomType, roomStatus, chargesPerDay) => {
  const [result] = await promiseConn.query(
    "UPDATE room SET room_type = ?, room_status = ?, charges_per_day = ? WHERE room_no = ?",
    [roomType, roomStatus, chargesPerDay, roomId]
  );
  return result.affectedRows > 0;
};

// Delete room:
exports.deleteRoom = async (roomId) => {
  const [result] = await promiseConn.query(
    "DELETE FROM room WHERE room_no = ?",
    [roomId]
  );
  return result.affectedRows > 0;
};

//--------------------------generate Bill--------------------------------

// Patient
exports.getPatientById = async (id) => {
  const [rows] = await promiseConn.query(
    "SELECT * FROM patients WHERE patient_id = ?",
    [id]
  );
  return rows[0];
};

// Appointment
exports.getLatestAppointmentByPatient = async (patientId) => {
  const [rows] = await promiseConn.query(
    `SELECT * FROM appointments 
     WHERE patient_id = ? ORDER BY appointment_date DESC LIMIT 1`,
    [patientId]
  );
  return rows[0];
};

// Doctor
exports.getDoctorById = async (doctorId) => {
  const [rows] = await promiseConn.query(
    "SELECT * FROM doctor WHERE doctor_id = ?",
    [doctorId]
  );
  return rows[0];
};

// Admission
exports.getAdmissionByAppointmentId = async (appointmentId) => {
  const [rows] = await promiseConn.query(
    "SELECT * FROM admissions WHERE appointment_id = ? LIMIT 1",
    [appointmentId]
  );
  return rows[0];
};

// Room
exports.getRoomByNo = async (roomNo) => {
  const [rows] = await promiseConn.query(
    "SELECT * FROM rooms WHERE room_no = ?",
    [roomNo]
  );
  return rows[0];
};

// Nurse
exports.getNurseById = async (nurseId) => {
  const [rows] = await promiseConn.query(
    "SELECT * FROM nurses WHERE nurse_id = ?",
    [nurseId]
  );
  return rows[0];
};

// Prescriptions
exports.getPrescriptionsByPatientId = async (patientId) => {
  const [rows] = await promiseConn.query(
    `SELECT p.quantity, p.dosage, p.frequency, m.medicine_name, m.price
     FROM prescriptions p
     JOIN medicines m ON p.medicine_id = m.medicine_id
     WHERE p.patient_id = ?`,
    [patientId]
  );
  return rows;
};
