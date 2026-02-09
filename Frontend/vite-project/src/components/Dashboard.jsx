import React, { useState } from "react";
import AdminApproval from "./AdminApproval";
import "../styles/Modalbansos.css";

const API_URL = "http://localhost:3000/api";

function Dashboard({ onClose }) {
  const [formData, setFormData] = useState({
    nik: "",
    password: "",
  });

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.nik || !formData.password) {
      setError("NIK dan password wajib diisi");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok || !data.success) {
        setError(data.message || "Login gagal");
        return;
      }

      if (data.user.role === 'admin') {
        setLoginSuccess(true);
      } else {
        setError("Hanya admin yang bisa login di sini");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server tidak bisa diakses");
    } finally {
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return <AdminApproval onClose={onClose} />;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>LOGIN ADMIN</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="nik"
              placeholder="NIK Admin"
              value={formData.nik}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password Admin"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <div className="modal-actions">
            <button 
              type="submit" 
              className="btn-search"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </div>

          
        </form>
      </div>
    </div>
  );
}

export default Dashboard;