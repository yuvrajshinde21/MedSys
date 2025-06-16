const mysql = require("mysql2");

// const conn = mysql.createConnection(
//     {
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_DATABASE,
//         port: process.env.DB_PORT
//     }
// );

// conn.connect((err)=>{
//     if(err){
//         return console.log(`DB_Error : ${err.message}`)
//     }
//     console.log(`DB_Connected successfully!`)
// })

// dbConfig.js
// module.exports = conn;



const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;


