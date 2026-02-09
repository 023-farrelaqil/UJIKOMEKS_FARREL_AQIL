const db = require("../config/db");

exports.login = (req, res) => {
  const { nik, password } = req.body;

  if (!nik || !password) {
    return res.status(400).json({
      success: false,
      message: "NIK dan password wajib diisi"
    });
  }

  const sql = `
    SELECT nik, password, role
    FROM users
    WHERE nik = ?
    LIMIT 1
  `;

  db.query(sql, [nik], (err, rows) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error"
      });
    }

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "NIK atau password salah"
      });
    }

    const user = rows[0];

    // 🔥 TANPA BCRYPT (PLAIN TEXT)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "NIK atau password salah"
      });
    }

    res.json({
      success: true,
      message: "Login admin berhasil",
      user: {
        nik: user.nik,
        role: user.role
      }
    });
  });
};
