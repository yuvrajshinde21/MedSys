const conn = require("../config/dbConfig");
const promiseConn = conn.promise();

// Save nurse to database
exports.saveNurse = async (nurse) => {
  const [result] = await promiseConn.query(
    "INSERT INTO nurses (nurse_name, nurse_contact, nurse_shift) VALUES (?, ?, ?)",
    [nurse.nurse_name, nurse.nurse_contact, nurse.nurse_shift]
  );
  return result.insertId;
};

// View all nurses
exports.getAllNurses = async () => {
  const [rows] = await promiseConn.query("SELECT * FROM nurses");
  return rows;
};

// Get nurse by ID
exports.getNurseById = async (nurseId) => {
  const [rows] = await promiseConn.query("SELECT * FROM nurses WHERE nurse_id = ?", [nurseId]);
  return rows.length > 0 ? rows[0] : null;
};


// Update nurse
exports.updateNurse = async (nurseId, nurse_name, nurse_contact, nurse_shift) => {
  const [result] = await promiseConn.query(
    "UPDATE nurses SET nurse_name = ?, nurse_contact = ?, nurse_shift = ? WHERE nurse_id = ?",
    [nurse_name, nurse_contact, nurse_shift, nurseId]
  );
  return result.affectedRows > 0;
};  

// Delete nurse
exports.deleteNurse = async (nurseId) => {
  const [result] = await promiseConn.query("DELETE FROM nurses WHERE nurse_id = ?", [nurseId]);
  return result.affectedRows > 0;
};
