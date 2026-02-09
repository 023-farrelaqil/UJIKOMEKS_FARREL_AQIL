const db = require("../config/db");

/* =======================
   GET PENGAJUAN (PENDING)
======================= */
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
      sktm,
      status,
      kategori_bansos,
      DATE_FORMAT(created_at, '%d %M %Y') AS tanggal
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

/* =======================
   APPROVE + PILIH KATEGORI
======================= */
exports.approvePengajuan = (req, res) => {
  const { id } = req.params;
  const { kategori_bansos } = req.body;

  if (!kategori_bansos) {
    return res.status(400).json({
      success: false,
      message: "Kategori bansos wajib dipilih"
    });
  }

  // Ambil data pengajuan
  db.query(
    "SELECT * FROM pengajuan_bansos WHERE id = ?",
    [id],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Data pengajuan tidak ditemukan"
        });
      }

      const p = results[0];

      // Transaksi biar aman
      db.getConnection((errConn, conn) => {
        if (errConn) {
          return res.status(500).json({
            success: false,
            message: "Koneksi database error"
          });
        }

        conn.beginTransaction((errTrans) => {
          if (errTrans) {
            conn.release();
            return res.status(500).json({
              success: false,
              message: "Transaction error"
            });
          }

          // Update status & kategori
          conn.query(
            `UPDATE pengajuan_bansos 
             SET status='disetujui', kategori_bansos=? 
             WHERE id=?`,
            [kategori_bansos, id],
            (errUpdate) => {
              if (errUpdate) {
                return conn.rollback(() => {
                  conn.release();
                  res.status(500).json({
                    success: false,
                    message: "Gagal update pengajuan"
                  });
                });
              }

              // Insert ke history / penerima
              conn.query(
                `INSERT INTO history_bansos 
                 (nik, kategori, created_at)
                 VALUES (?, ?, NOW())`,
                [p.nik, kategori_bansos],
                (errHistory) => {
                  if (errHistory) {
                    return conn.rollback(() => {
                      conn.release();
                      res.status(500).json({
                        success: false,
                        message: "Gagal simpan history bansos"
                      });
                    });
                  }

                  conn.commit((errCommit) => {
                    if (errCommit) {
                      return conn.rollback(() => {
                        conn.release();
                        res.status(500).json({
                          success: false,
                          message: "Commit gagal"
                        });
                      });
                    }

                    conn.release();
                    res.json({
                      success: true,
                      message: "Pengajuan berhasil disetujui"
                    });
                  });
                }
              );
            }
          );
        });
      });
    }
  );
};

/* =======================
   REJECT PENGAJUAN
======================= */
exports.rejectPengajuan = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE pengajuan_bansos SET status='ditolak' WHERE id=?",
    [id],
    (err, result) => {
      if (err) {
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
