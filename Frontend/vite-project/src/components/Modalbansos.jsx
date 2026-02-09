import "../styles/Modalbansos.css";
import React, { useState } from "react";
import ModalHasilBansos from "./ModalHasilBansos";

function ModalBansos({ onClose }) {
  const [nik, setNik] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nik || nik.length !== 16) {
      alert("NIK harus 16 digit!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/bansos/cek/${nik}`
      );

      if (!response.ok) {
        throw new Error("Data tidak ditemukan");
      }

     const data = await response.json();

setResultData({
  nik: data.data.nik,
  nama: data.data.nama,
  daerah: data.data.daerah,
  kategori: data.data.kategori,
  tanggal: data.data.tanggal_disetujui || data.data.tanggal_pengajuan,
  status: data.message
});


      setShowResult(true);
    } catch (error) {
      alert("Data tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>PENCARIAN DATA PM BANSOS</h3>
            <button className="btn-close" onClick={onClose}>×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Masukkan NIK (16 Digit)"
              value={nik}
              maxLength={16}
              onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
            />

            <div className="modal-actions">
              <button
                type="button"
                className="btn-reset"
                onClick={() => setNik("")}
              >
                Reset
              </button>
              <button type="submit" className="btn-search" disabled={loading}>
                {loading ? "Mencari..." : "Cari Data"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalHasilBansos
        show={showResult}
        onClose={() => setShowResult(false)}
        data={resultData}
      />
    </>
  );
}

export default ModalBansos;
