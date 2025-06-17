const conn = require("../config/dbConfig");

exports.authenticateUser = async (username) => {
    const [rows] = await conn.promise().query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );
    return rows[0];
};

//get receptionist by id
exports.getUserById = async (userId) => {
    const [rows] = await conn.promise().query(
        "SELECT * FROM reception WHERE user_id = ?",
        [userId]
    );
    return rows[0];
};