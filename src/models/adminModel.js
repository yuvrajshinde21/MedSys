const conn = require("../config/dbConfig")

exports.isUserNameTaken = async (username) => {
    const [result] = await conn.promise().query("SELECT * FROM users WHERE username = ?", [username]);
    return result.length > 0;
}

exports.createUser = async (username, password, role) => {
    const [result] = await conn.promise().query("INSERT INTO users(username,password,role)VALUES(?,?,?)", [username, password, role]);
    return result.insertId;
}


exports.createDoctor = async (doctor_name,doctor_specialization, doctor_contact, doctor_email, doctor_experience, status, user_id, admin_id) => {
    const [result] = await conn.promise().query(
        `INSERT INTO doctor (
        doctor_name,
        doctor_specialization,
        doctor_contact,
        doctor_experience,
        status,
        user_id,
        admin_id,
        doctor_email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            doctor_name, 
            doctor_specialization, 
            doctor_contact, 
            doctor_experience, 
            status, 
            user_id, 
            admin_id, 
            doctor_email
        ]
    );
    return result.affectedRows;
}





