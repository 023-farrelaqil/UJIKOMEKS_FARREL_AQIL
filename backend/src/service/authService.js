const db = require("../config/db");

exports.login = (nik, password, callback) => {
  const sql = "SELECT nik, password, role FROM users WHERE nik = ? LIMIT 1";
  
  db.query(sql, [nik], (err, rows) => {
    if (err) return callback(err);
    
    if (rows.length === 0) {
      return callback(null, null);
    }

    const user = rows[0];
    
    // Simple password check (plain text for demo)
    if (user.password !== password) {
      return callback(null, null);
    }

    return callback(null, user);
  });
};