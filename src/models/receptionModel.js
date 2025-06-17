const conn = require("../config/dbConfig");
const promiseConn = conn.promise();

//get receptionInfo
exports.getReceptionistInfo = async (receptionistId) => {
  const [rows] = await promiseConn.query(
    "SELECT * FROM reception WHERE user_id = ?",
    [receptionistId]
  );
  return rows[0];
};

exports.saveRoom = async (room) => {
  const [result] = await promiseConn.query(
    "INSERT INTO room (room_no, room_type, room_status, charges_per_day) VALUES (?, ?, ?, ?)",
    [room.room_no, room.room_type, room.room_status, room.charges_per_day]
  );
  return result.insertId;
};

// View all rooms
exports.getAllRooms = async () => {
  const [rows] = await promiseConn.query("SELECT * FROM room");
  return rows;
};

// Get room by ID
exports.getRoomTypes = async () => {
  const [rows] = await promiseConn.query("SELECT DISTINCT room_type FROM room");
  return rows.map(r => r.room_type);
};

// Get room by id
exports.getRoomById = async (roomId) => {
    const [rows] = await promiseConn.query("SELECT * FROM room WHERE room_no = ?", [roomId]);
    return rows.length > 0 ? rows[0] : null;
};

// Update room status
exports.updateRoom = async (roomId, roomType, roomStatus, chargesPerDay) => {
  const [result] = await promiseConn.query(
    "UPDATE room SET room_type = ?, room_status = ?, charges_per_day = ? WHERE room_no = ?",
    [roomType, roomStatus, chargesPerDay, roomId]
  );
  return result.affectedRows > 0;
};

// Delete room
exports.deleteRoom = async (roomId) => {
  const [result] = await promiseConn.query("DELETE FROM room WHERE room_no = ?", [roomId]);
  return result.affectedRows > 0;
};

// Save nurse to database
exports.saveNurse = async (nurse) => {
  const [result] = await promiseConn.query(
    "INSERT INTO nurse (nurse_name, nurse_contact, nurse_shift) VALUES (?, ?, ?)",
    [nurse.nurse_name, nurse.nurse_contact, nurse.nurse_shift]
  );
  return result.insertId;
};

// View all nurses
exports.getAllNurses = async () => {
  const [rows] = await promiseConn.query("SELECT * FROM nurse");
  return rows;
};

// Get nurse by ID
exports.getNurseById = async (nurseId) => {
  const [rows] = await promiseConn.query("SELECT * FROM nurse WHERE nurse_id = ?", [nurseId]);
  return rows.length > 0 ? rows[0] : null;
};


// Update nurse
exports.updateNurse = async (nurseId, nurse_name, nurse_contact, nurse_shift) => {
  const [result] = await promiseConn.query(
    "UPDATE nurse SET nurse_name = ?, nurse_contact = ?, nurse_shift = ? WHERE nurse_id = ?",
    [nurse_name, nurse_contact, nurse_shift, nurseId]
  );
  return result.affectedRows > 0;
};  

// Delete nurse
exports.deleteNurse = async (nurseId) => {
  const [result] = await promiseConn.query("DELETE FROM nurse WHERE nurse_id = ?", [nurseId]);
  return result.affectedRows > 0;
};



// Save patient to database
exports.savePatient = async (patient) => {
  const [result] = await promiseConn.query(
    `INSERT INTO patient 
    (patient_name, patient_age, patient_gender, patient_contact, patient_issue, admitted_date, discharge_date, room_no, nurse_id, doctor_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      patient.patient_name,
      patient.patient_age,
      patient.patient_gender,
      patient.patient_contact,
      patient.patient_issue,
      patient.admitted_date,
      patient.discharge_date,
      patient.room_no,
      patient.nurse_id,
      patient.doctor_id,
      patient.status,
    ]
  );
  return result.insertId;
};

// View all patients
exports.getAllPatients = async () => {
  const [rows] = await promiseConn.query("select * from patient");
  return rows;
};
