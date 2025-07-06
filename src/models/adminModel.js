const conn = require("../config/dbConfig");

const promiseConn = conn.promise();
// Function to get specializations
exports.getSpecializations = async () => {
    const [result] = await promiseConn.query("SELECT * FROM specializations ORDER BY specialization_name ASC");
    return result;
}

// Function to check if a username is already taken
exports.isUserNameTaken = async (username) => {
    const [result] = await promiseConn.query("SELECT * FROM users WHERE username = ?", [username]);
    return result.length > 0;
}
// Function to create a new user
exports.createUser = async (username, password, role) => {
    const [result] = await promiseConn.query("INSERT INTO users(username,password,role)VALUES(?,?,?)", [username, password, role]);
    return result.insertId;
}

// Function to create a new doctor
exports.createDoctor = async (doctor_name, doctor_specialization, doctor_contact, doctor_email, doctor_experience, status, user_id, admin_id, doctor_image) => {
    const [result] = await promiseConn.query(
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

// Function to get all doctors and specializations
exports.getDoctors = async () => {
    const [result] = await promiseConn.query("SELECT d.*, s.specialization_name FROM doctor d LEFT JOIN specializations s ON d.doctor_specialization = s.specialization_id WHERE d.is_deleted = 0 ORDER BY d.doctor_name ASC");
    return result;
}
// Function to delete a doctor (soft delete)
exports.deleteDoctor = async (doctor_id) => {
    const [result] = await promiseConn.query("UPDATE doctor SET is_deleted = 1 WHERE doctor_id = ?", [doctor_id]);
    return result.affectedRows;
}
// Function to get a doctor by ID and include specialization name
exports.getDoctorById = async (doctor_id) => {
    const [result] = await promiseConn.query("SELECT d.*, s.specialization_name FROM doctor d LEFT JOIN specializations s ON d.doctor_specialization = s.specialization_id WHERE d.doctor_id = ?", [doctor_id]);
    return result[0];
}
// Function to update doctor details
exports.updateDoctor = async (doctor_id, doctor_name, doctor_specialization, doctor_contact, doctor_email, doctor_experience, status, doctor_image) => {
    const [result] = await promiseConn.query(
        `UPDATE doctor SET 
            doctor_name = ?, 
            doctor_specialization = ?, 
            doctor_contact = ?, 
            doctor_email = ?, 
            doctor_experience = ?, 
            status = ?, 
            doctor_image = ?
        WHERE doctor_id = ?`,
        [
            doctor_name,
            doctor_specialization,
            doctor_contact,
            doctor_email,
            doctor_experience,
            status,
            doctor_image,
            doctor_id
        ]
    );
    return result.affectedRows;
}

//function create receptionist user with recesptionist
exports.createReceptionWithUser = async (reception_name, username, password, reception_contact, reception_email, status, admin_id, reception_image, role) => {
console.log("=========")
    const connection = await promiseConn.getConnection();
    try {
        await connection.beginTransaction();
        //create user
        const [userResult] = await connection.query(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            [username, password, role]
        );
        const user_id = userResult.insertId;

        //create receptionist
        const [receptionResult] = await connection.query(
            `INSERT INTO reception (
                reception_name,
                reception_contact,
                reception_email,
                status,
                user_id,
                admin_id,
                reception_image
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                reception_name,
                reception_contact,
                reception_email,
                status,
                user_id,
                admin_id,
                reception_image
            ]
        );

        await connection.commit();
        console.log("not=errr")

        return { success: true, message: "Receptionist registered successfully " };
    } catch (error) {
        await connection.rollback();
        console.error("Reception creation error:", error);
        return { success: false, message: "Something went wrong while saving the receptionist " };
    } finally {
        connection.release();
    }
}
// Function to get all receptionists
exports.getReceptionists = async () => {
    const [result] = await promiseConn.query("SELECT * FROM reception WHERE is_deleted = 0 ORDER BY reception_name ASC");
    return result;
}

// Function to delete a receptionist (soft delete)
exports.deleteReception = async (reception_id) => {
    console.log("Deleting receptionist with ID:", reception_id);
    const [result] = await promiseConn.query("UPDATE reception SET is_deleted = 1 WHERE reception_id = ?", [reception_id]);
    return result.affectedRows;
}

//get receptionist by id
exports.getReceptionById = async (reception_id) => {
    const [result] = await promiseConn.query("SELECT * FROM reception WHERE reception_id = ?", [reception_id]);
    return result[0];
}

// Function to update receptionist details
exports.updateReception = async (reception_id, reception_name, reception_contact, reception_email, status, reception_image) => {
    try {
        const [result] = await promiseConn.query(
            `UPDATE reception SET 
            reception_name = ?, 
            reception_contact = ?, 
            reception_email = ?, 
            status = ?, 
            reception_image = ?
        WHERE reception_id = ?`,
            [
                reception_name,
                reception_contact,
                reception_email,
                status,
                reception_image,
                reception_id
            ]
        );
        return result.affectedRows;
    } catch (error) {
        console.error("Error updating receptionist:", error);
        throw error; // Re-throw the error for further handling
    }
}


// Function to get all patients
exports.getAllPatients = async () => {
    const [rows] = await promiseConn.query("SELECT * FROM patients");
    return rows;
};