import "../styles/ModalPengajuanBansos.css";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api";

function ModalPengajuanBansos({ onClose }) {
  const [provinsi, setProvinsi] = useState([]);
  const [kabkota, setKabkota] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);
  const [desa, setDesa] = useState([]);

  const [loading, setLoading] = useState(false);

  // ================= FORM DATA =================
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    telepon: "",
    provinsi: "",
    kabkota: "",
    kecamatan: "",
    desa: "",
    sktm: null
  });

  // ================= SIMPAN NAMA WILAYAH =================
  const [namaWilayah, setNamaWilayah] = useState({
    provinsi: "",
    kabkota: "",
    kecamatan: "",
    desa: ""
  });

  /* ================= FETCH PROVINSI ================= */
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then(res => res.json())
      .then(setProvinsi);
  }, []);

  /* ================= FETCH KAB/KOTA ================= */
  useEffect(() => {
    if (!formData.provinsi) return;

    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${formData.provinsi}.json`)
      .then(res => res.json())
      .then(setKabkota);

    setFormData(prev => ({ ...prev, kabkota: "", kecamatan: "", desa: "" }));
    setKecamatan([]);
    setDesa([]);
  }, [formData.provinsi]);

  /* ================= FETCH KECAMATAN ================= */
  useEffect(() => {
    if (!formData.kabkota) return;

    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${formData.kabkota}.json`)
      .then(res => res.json())
      .then(setKecamatan);

    setFormData(prev => ({ ...prev, kecamatan: "", desa: "" }));
    setDesa([]);
  }, [formData.kabkota]);

  /* ================= FETCH DESA ================= */
  useEffect(() => {
    if (!formData.kecamatan) return;

    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${formData.kecamatan}.json`)
      .then(res => res.json())
      .then(setDesa);
  }, [formData.kecamatan]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "provinsi") {
      const selected = provinsi.find(p => p.id === value);
      setNamaWilayah(prev => ({ ...prev, provinsi: selected?.name || "" }));
    }

    if (name === "kabkota") {
      const selected = kabkota.find(k => k.id === value);
      setNamaWilayah(prev => ({ ...prev, kabkota: selected?.name || "" }));
    }

    if (name === "kecamatan") {
      const selected = kecamatan.find(k => k.id === value);
      setNamaWilayah(prev => ({ ...prev, kecamatan: selected?.name || "" }));
    }

    if (name === "desa") {
      const selected = desa.find(d => d.id === value);
      setNamaWilayah(prev => ({ ...prev, desa: selected?.name || "" }));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("nik", formData.nik);
    data.append("nama", formData.nama);
    data.append("telepon", formData.telepon);

    // ⬇️ SIMPAN NAMA WILAYAH (BUKAN ID)
    data.append("provinsi", namaWilayah.provinsi);
    data.append("kabkota", namaWilayah.kabkota);
    data.append("kecamatan", namaWilayah.kecamatan);
    data.append("desa", namaWilayah.desa);

    data.append("kategori_id", 1);
    data.append("sktm", formData.sktm);

    try {
      const response = await fetch(`${API_URL}/bansos/pengajuan`, {
        method: "POST",
        body: data
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Pengajuan bansos berhasil! Menunggu approval admin.");
        onClose();
      }
    } catch (err) {
      // ignore
    }

    setLoading(false);
  };

  /* ================= RENDER ================= */
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box large-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>PENGAJUAN BANSOS</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input name="nama" placeholder="Nama Sesuai KTP" onChange={handleChange} required />
          <input name="nik" placeholder="NIK (16 Digit)" maxLength={16} onChange={e => setFormData(p => ({ ...p, nik: e.target.value.replace(/\D/g, "") }))} required />
          <input name="telepon" placeholder="Nomor Telepon" onChange={handleChange} required />

          <select name="provinsi" onChange={handleChange} required>
            <option value="">Pilih Provinsi</option>
            {provinsi.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <select name="kabkota" onChange={handleChange} required>
            <option value="">Pilih Kab/Kota</option>
            {kabkota.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
          </select>

          <select name="kecamatan" onChange={handleChange} required>
            <option value="">Pilih Kecamatan</option>
            {kecamatan.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
          </select>

          <select name="desa" onChange={handleChange} required>
            <option value="">Pilih Desa</option>
            {desa.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          <input type="file" name="sktm" accept="image/*,application/pdf" onChange={handleChange} required />

          <div className="modal-actions">
            <button type="button" className="btn-reset" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-search" disabled={loading}>
              {loading ? "Mengajukan..." : "Ajukan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalPengajuanBansos;
