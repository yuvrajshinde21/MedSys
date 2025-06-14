const e = require("express");
const conn = require("../config/dbConfig")

exports.isUserNameTaken = async (username) => {
    const [result] = await conn.promise().query("SELECT * FROM users WHERE username = ?", [username]);
    return result.length > 0;
}

exports.createUser = async (username, password, role) => {
    const [result] = await conn.promise().query("INSERT INTO users(username,password,role)VALUES(?,?,?)", [username, password, role]);
    return result.insertId;
}


exports.createDoctor = async (doctor_name, doctor_specialization, doctor_contact, doctor_email, doctor_experience, status, user_id, admin_id, doctor_image) => {
    const [result] = await conn.promise().query(
        `INSERT INTO doctor (
        doctor_name,
        doctor_specialization,
        doctor_contact,
        doctor_experience,
        status,
        user_id,
        admin_id,
        doctor_email,
        doctor_image 
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`,
        [
            doctor_name,
            doctor_specialization,
            doctor_contact,
            doctor_experience,
            status,
            user_id,
            admin_id,
            doctor_email,
            doctor_image
        ]
    );
    return result.affectedRows;
}


exports.getDoctors = async () => {
    const [result] = await conn.promise().query("SELECT * FROM doctor WHERE is_deleted = 0 ORDER BY doctor_name ASC");
    return result;
}

exports.deleteDoctor = async (doctor_id) => {
    const [result] = await conn.promise().query("UPDATE doctor SET is_deleted = 1 WHERE doctor_id = ?", [doctor_id]);
    return result.affectedRows;
}

exports.getDoctorById = async (doctor_id) => {
    const [result] = await conn.promise().query("SELECT * FROM doctor WHERE doctor_id = ?", [doctor_id]);
    return result[0];
}

exports.updateDoctor = async (doctor_id, doctor_name, doctor_specialization, doctor_contact, doctor_email, doctor_experience, status, user_id, admin_id, doctor_image) => {
    const [result] = await conn.promise().query(
        `UPDATE doctor SET 
            doctor_name = ?, 
            doctor_specialization = ?, 
            doctor_contact = ?, 
            doctor_email = ?, 
            doctor_experience = ?, 
            status = ?, 
            user_id = ?, 
            admin_id = ?,
            doctor_image = ?
        WHERE doctor_id = ?`,
        [
            doctor_name,
            doctor_specialization,
            doctor_contact,
            doctor_email,
            doctor_experience,
            status,
            user_id,
            admin_id,
            doctor_image,
            doctor_id
        ]
    );
    return result.affectedRows;
}


