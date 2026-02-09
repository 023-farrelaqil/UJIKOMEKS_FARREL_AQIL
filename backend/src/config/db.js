const mysql = require("mysql2");

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "bansos_db",
  port: 3306,          // ⬅️ WAJIB 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ Database connected (bansos_db)");
    connection.release();
  }
});

module.exports = db;
