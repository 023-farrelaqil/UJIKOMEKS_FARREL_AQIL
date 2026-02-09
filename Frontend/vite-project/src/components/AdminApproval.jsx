import React, { useEffect, useState } from "react";
import "../styles/AdminApproval.css";

function AdminApproval({ onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const kategoriList = [
    "Program Keluarga Harapan (PKH)",
    "Bantuan Pangan Non-Tunai (BPNT)",
    "Bantuan Pendidikan (PIP)",
    "Penerima Bantuan Iuran Jaminan Kesehatan (PBI-JKN)",
    "Program Indonesia Pintar (PIP/KIP)",
    "Bantuan Langsung Tunai (BLT)",
    "Program Asistensi Rehabilitasi Sosial (ATENSI)",
    "Bantuan Sosial Lainnya",
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/admin/pengajuan");
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      alert("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = async (id, kategori) => {
    if (!kategori) {
      alert("Pilih kategori bansos terlebih dahulu!");
      return;
    }

    if (!window.confirm("Yakin setujui pengajuan ini?")) return;

    await fetch(`http://localhost:3000/api/admin/approve/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kategori_bansos: kategori }),
    });

    loadData();
  };

  const reject = async (id) => {
    if (!window.confirm("Yakin tolak pengajuan ini?")) return;

    await fetch(`http://localhost:3000/api/admin/reject/${id}`, {
      method: "PUT",
    });

    loadData();
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <h3>Penerimaan Pengajuan Bansos</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : data.length === 0 ? (
          <p className="empty">Tidak ada pengajuan</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>NIK</th>
                <th>Nama</th>
                <th>SKTM</th>
                <th>Kategori</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id}>
                  <td>{d.nik}</td>
                  <td>{d.nama}</td>
                  <td>
                    <a
                      href={`http://localhost:3000/uploads/${d.sktm}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lihat
                    </a>
                  </td>

                  <td>
                    <select
                      className="kategori-select"
                      onChange={(e) => (d.kategori = e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Pilih Kategori
                      </option>
                      {kategoriList.map((k, i) => (
                        <option key={i} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="aksi">
                    <button
                      className="btn-approve"
                      onClick={() => approve(d.id, d.kategori)}
                    >
                      Terima
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => reject(d.id)}
                    >
                      Tolak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminApproval;
