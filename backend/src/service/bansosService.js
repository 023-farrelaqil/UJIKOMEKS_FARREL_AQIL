const db = require("../config/db");

// USER AJUKAN BANSOS
exports.insertPengajuan = (data, callback) => {
  const sql = `
    INSERT INTO pengajuan_bansos (nik, sktm, kategori, status)
    VALUES (?, ?, ?, 'pending')
  `;
  db.query(sql, [data.nik, data.sktm, data.kategori], callback);
};

// ADMIN LIHAT PENGAJUAN (PENDING)
exports.getAllPengajuan = (callback) => {
  const sql = `
    SELECT p.id, p.nik, w.nama, p.kategori, p.status
    FROM pengajuan_bansos p
    JOIN warga w ON p.nik = w.nik
    WHERE p.status = 'pending'
  `;
  db.query(sql, callback);
};

// AMBIL DATA PENGAJUAN BY ID
exports.getPengajuanById = (id, callback) => {
  const sql = `
    SELECT nik, kategori FROM pengajuan_bansos WHERE id = ?
  `;
  db.query(sql, [id], callback);
};

// UPDATE STATUS APPROVED
exports.approvePengajuan = (id, callback) => {
  const sql = `
    UPDATE pengajuan_bansos SET status='approved' WHERE id=?
  `;
  db.query(sql, [id], callback);
};

// INSERT KE HISTORY
exports.insertHistory = (nik, kategori, callback) => {
  const sql = `
    INSERT INTO history_bansos (nik, kategori)
    VALUES (?, ?)
  `;
  db.query(sql, [nik, kategori], callback);
};

// USER CEK BANSOS
exports.getHistoryByNik = (nik, callback) => {
  const sql = `
    SELECT 
      h.nik,
      h.kategori,
      w.nama,
      w.provinsi,
      w.kabkota,
      w.kecamatan,
      w.desa
    FROM history_bansos h
    LEFT JOIN warga w 
      ON TRIM(w.nik) = TRIM(h.nik)
    WHERE TRIM(h.nik) = ?
    ORDER BY h.id DESC
    LIMIT 1
  `;
  db.query(sql, [nik.trim()], callback);
};



