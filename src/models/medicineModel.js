const db = require('../config/dbConfig');
const asynchandler = require('express-async-handler');
const conn = require("../config/dbConfig");
const promiseConn = conn.promise();


// Insert a Medicine Entry
exports.saveMedicine = asynchandler(async (medicine_name, price) => {
    const [result] = await db.promise().query(
        `INSERT INTO medicines (medicine_name, price) VALUES (?, ?)`,
        [medicine_name, price]
    );

    if (result.affectedRows === 0) {
        throw new Error("Failed to insert medicine.");
    }

    return result;
});


// View all Medicines
exports.viewMedicines = asynchandler(async () => {  
    const [result] = await db.promise().query("SELECT * FROM medicines");
    if (result.length === 0) {
        throw new Error("No medicines found.");
    }
    return result;
});

// Delete a Medicine Entry
exports.deleteMedicine = async (medicineId) => {
  const [result] = await promiseConn.query("DELETE FROM medicines WHERE medicine_id = ?", [medicineId]);
  return result.affectedRows > 0;
};