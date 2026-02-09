import "../styles/ModalHasilBansos.css";
import React from "react";

function ModalHasilBansos({ show, onClose, data }) {
  if (!show || !data) return null;

  const getStatusClass = (status) => {
    if (!status) return "status-gray";
    const s = status.toLowerCase();
    if (s.includes("setuju") || s.includes("approve")) return "status-green";
    if (s.includes("pending") || s.includes("proses")) return "status-orange";
    if (s.includes("tolak") || s.includes("reject")) return "status-red";
    return "status-gray";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>HASIL PENCARIAN</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="result-row">
            <span className="label">NIK</span>
            <span className="value">{data.nik}</span>
          </div>

          <div className="result-row">
            <span className="label">Nama</span>
            <span className="value">{data.nama}</span>
          </div>

          {data.daerah && (
            <div className="result-row">
              <span className="label">Daerah</span>
              <span className="value">{data.daerah}</span>
            </div>
          )}

          {data.kategori && (
            <div className="result-row">
              <span className="label">Kategori Bansos</span>
              <span className="kategori-badge">{data.kategori}</span>
            </div>
          )}

          {data.tanggal && (
            <div className="result-row">
              <span className="label">Tanggal</span>
              <span className="value">{data.tanggal}</span>
            </div>
          )}

          <div className="result-row">
            <span className="label">Status</span>
            <span className={`status-badge ${getStatusClass(data.status)}`}>
              {data.status}
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

export default ModalHasilBansos;
