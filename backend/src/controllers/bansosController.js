const db = require("../config/db");

/* ================= PUBLIC: CEK BANSOS ================= */
exports.cekBansos = (req, res) => {
  const nik = req.params.nik.trim();
  
  if (!nik || nik.length !== 16) {
    return res.status(400).json({
      success: false,
      message: "NIK harus 16 digit angka"
    });
  }

  console.log(`🔍 Cek bansos untuk NIK: ${nik}`);

  // Cek di history_bansos (sudah approved)
  const sql = `
    SELECT 
      h.nik,
      w.nama_lengkap AS nama,
      CONCAT(w.provinsi, ', ', w.kabkota, ', ', w.kecamatan, ', ', w.desa) AS daerah,
      h.kategori,
      DATE_FORMAT(h.created_at, '%d %M %Y') AS tanggal_disetujui
    FROM history_bansos h
    JOIN warga w ON h.nik = w.nik
    WHERE h.nik = ?
    ORDER BY h.created_at DESC
    LIMIT 1
  `;

  db.query(sql, [nik], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server"
      });
    }

    if (results.length > 0) {
      return res.json({
        success: true,
        message: "Data ditemukan",
        data: results[0]
      });
    }

    // Jika tidak ada di history, cek di pengajuan
    const pendingSql = `
      SELECT 
        nik,
        nama,
        status,
        DATE_FORMAT(created_at, '%d %M %Y') AS tanggal_pengajuan
      FROM pengajuan_bansos 
      WHERE nik = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    db.query(pendingSql, [nik], (pendingErr, pendingResults) => {
      if (pendingErr) {
        console.error("Pending check error:", pendingErr);
      }

      if (pendingResults.length > 0) {
        const item = pendingResults[0];
        let message = "";
        
        if (item.status === 'pending') {
          message = "Pengajuan sedang diproses";
        } else if (item.status === 'rejected') {
          message = "Pengajuan ditolak";
        }

        return res.json({
          success: true,
          message: message,
          data: {
            nik: item.nik,
            nama: item.nama,
            status: item.status,
            tanggal_pengajuan: item.tanggal_pengajuan,
            keterangan: item.status === 'pending' 
              ? "Menunggu persetujuan admin" 
              : "Silakan hubungi admin untuk informasi lebih lanjut"
          }
        });
      }

      // Tidak ditemukan sama sekali
      res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
        detail: "NIK ini belum terdaftar dalam sistem bansos"
      });
    });
  });
};

/* ================= PUBLIC: AJUKAN BANSOS ================= */
exports.ajukanBansos = (req, res) => {
  const {
    nik,
    nama,
    telepon,
    provinsi,
    kabkota,
    kecamatan,
    desa,
    kategori_id = 1
  } = req.body;

  // Validasi
  if (!nik || !nama || !telepon || !provinsi || !kabkota || !kecamatan || !desa) {
    return res.status(400).json({
      success: false,
      message: "Semua field wajib diisi"
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File SKTM wajib diupload"
    });
  }

  if (nik.length !== 16) {
    return res.status(400).json({
      success: false,
      message: "NIK harus 16 digit"
    });
  }

  const sktm = req.file.filename;

  // Cek duplikat NIK pending
  const checkSql = "SELECT id FROM pengajuan_bansos WHERE nik = ? AND status = 'pending'";
  
  db.query(checkSql, [nik], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Check error:", checkErr);
      return res.status(500).json({
        success: false,
        message: "Gagal memeriksa data"
      });
    }

    if (checkResults.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Anda sudah memiliki pengajuan yang sedang diproses"
      });
    }

    // Insert pengajuan baru
    const insertSql = `
      INSERT INTO pengajuan_bansos 
      (nik, nama, telepon, provinsi, kabkota, kecamatan, desa, kategori_id, sktm, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    db.query(
      insertSql,
      [nik, nama, telepon, provinsi, kabkota, kecamatan, desa, kategori_id, sktm],
      (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Insert error:", insertErr);
          return res.status(500).json({
            success: false,
            message: "Gagal menyimpan pengajuan"
          });
        }

        res.status(201).json({
          success: true,
          message: "Pengajuan bansos berhasil disimpan!",
          detail: "Data Anda akan diverifikasi oleh admin.",
          id: insertResult.insertId
        });
      }
    );
  });
};

/* ================= ADMIN: GET PENGAJUAN ================= */
exports.getPengajuan = (req, res) => {
  const sql = `
    SELECT 
      id,
      nik,
      nama,
      telepon,
      provinsi,
      kabkota,
      kecamatan,
      desa,
      kategori_id,
      sktm,
      status,
      DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS tanggal
    FROM pengajuan_bansos 
    WHERE status = 'pending'
    ORDER BY created_at ASC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get pengajuan error:", err);
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data pengajuan"
      });
    }
    
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });
};

/* ================= ADMIN: APPROVE ================= */
exports.approveBansos = (req, res) => {
  const { id } = req.params;
  const { kategori_bansos } = req.body;

  if (!kategori_bansos) {
    return res.status(400).json({
      success: false,
      message: "Kategori bansos wajib dipilih"
    });
  }

  db.query(
    "SELECT * FROM pengajuan_bansos WHERE id = ?",
    [id],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pengajuan tidak ditemukan"
        });
      }

      const p = results[0];

      db.getConnection((_, conn) => {
        conn.beginTransaction(() => {

          conn.query(
            `INSERT INTO warga (nik, nama_lengkap, telepon, provinsi, kabkota, kecamatan, desa)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE nama_lengkap = VALUES(nama_lengkap)`,
            [p.nik, p.nama, p.telepon, p.provinsi, p.kabkota, p.kecamatan, p.desa],
            () => {

              conn.query(
                `INSERT INTO history_bansos (nik, kategori)
                 VALUES (?, ?)`,
                [p.nik, kategori_bansos],
                () => {

                  conn.query(
                    `UPDATE pengajuan_bansos SET status = 'approved' WHERE id = ?`,
                    [id],
                    () => {
                      conn.commit(() => {
                        conn.release();
                        res.json({
                          success: true,
                          message: "Pengajuan disetujui"
                        });
                      });
                    }
                  );

                }
              );

            }
          );

        });
      });
    }
  );
};


/* ================= ADMIN: REJECT ================= */
exports.rejectBansos = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE pengajuan_bansos SET status = 'rejected' WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Reject error:", err);
        return res.status(500).json({
          success: false,
          message: "Gagal menolak pengajuan"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Data tidak ditemukan"
        });
      }

      res.json({
        success: true,
        message: "Pengajuan berhasil ditolak"
      });
    }
  );
};