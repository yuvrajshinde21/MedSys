    const mysql = require("mysql2");

    const conn = mysql.createConnection(
        {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT
        }
    );

    conn.connect((err)=>{
        if(err){
            return console.log(`DB_Error : ${err.message}`)
        }
        console.log(`DB_Connected successfully!`)
    })
    module.exports = conn;