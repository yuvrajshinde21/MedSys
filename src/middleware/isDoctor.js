const conn = require("../config/dbConfig");
module.exports.isDoctor = async (req, res, next) => {
  try {
    const [doctor] = await conn.promise().execute(
      "SELECT * FROM doctor WHERE user_id = ?",
      [req.user.user_id]
    );

    if (doctor.length === 0) {
      return res.status(403).redirect("/auth/login");
    }

    req.user.doctorId = doctor[0].doctor_id;
    next();
  } catch (err) {
    console.error("Doctor middleware error:", err.message);
    res.status(500).send("Internal Server Error");
  }
};

