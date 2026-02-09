import React, { useState } from "react";
import "../styles/Navbar.css";
import gambar from "../assets/logobansos.png";
import ModalPengajuanBansos from "./ModalPengajuanBansos";
import Dashboard from "./Dashboard";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPengajuan, setShowPengajuan] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const navItems = [
    { label: "Halaman Utama", href: "#" },
    { label: "Projek", href: "#projects" },
    { label: "Media Sosial", href: "#footer" },
    { label: "Pengajuan Bansos", action: "pengajuan" },
    { label: "Dashboard Admin", action: "dashboard" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <img
            src={gambar}
            alt="Logo Bantuan Sosial"
            className="navbar-logo"
          />

          {/* Desktop Menu */}
          <div className="navbar-menu">
            {navItems.map((item, index) =>
              item.action === "pengajuan" ? (
                <span
                  key={index}
                  className="navbar-link"
                  onClick={() => setShowPengajuan(true)}
                >
                  {item.label}
                </span>
              ) : item.action === "dashboard" ? (
                <span
                  key={index}
                  className="navbar-link"
                  onClick={() => setShowDashboard(true)}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  key={index}
                  href={item.href}
                  className="navbar-link"
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={isOpen ? "bar rotate1" : "bar"}></span>
            <span className={isOpen ? "bar fade" : "bar"}></span>
            <span className={isOpen ? "bar rotate2" : "bar"}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="navbar-mobile">
            {navItems.map((item, index) =>
              item.action === "pengajuan" ? (
                <span
                  key={index}
                  className="navbar-mobile-link"
                  onClick={() => {
                    setShowPengajuan(true);
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </span>
              ) : item.action === "dashboard" ? (
                <span
                  key={index}
                  className="navbar-mobile-link"
                  onClick={() => {
                    setShowDashboard(true);
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  key={index}
                  href={item.href}
                  className="navbar-mobile-link"
                >
                  {item.label}
                </a>
              )
            )}
          </div>
        )}
      </nav>

      {/* MODAL PENGAJUAN */}
      {showPengajuan && (
        <ModalPengajuanBansos
          onClose={() => setShowPengajuan(false)}
        />
      )}

      {/* DASHBOARD ADMIN */}
      {showDashboard && (
        <Dashboard
          onClose={() => setShowDashboard(false)}
        />
      )}
    </>
  );
}

export default Navbar;
