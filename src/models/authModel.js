const conn = require("../config/dbConfig");

exports.authenticateUser = async (userData) => {
    const { username, password, role } = userData;
    const [rows] = await conn.promise().query(
        "SELECT * FROM users WHERE username = ? AND password = ? AND role = ?",
        [username, password, role]
    );
    return rows[0]; 
};
