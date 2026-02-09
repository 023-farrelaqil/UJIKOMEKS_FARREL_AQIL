import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Hero.css';
import gambar from '../assets/bansos9.png';
import ModalBansos from './Modalbansos.jsx';



function Hero() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${gambar})` }}>
        <div className="hero-overlay"></div>

        <div className="hero-container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <p className="hero-text">
              Untuk mengecek status bantuan sosial Anda, <br />
              silakan klik tombol di bawah.
            </p>

            <button
              className="hero-button"
              onClick={() => setShowModal(true)}
            >
              Cek Bansos
            </button>
          </motion.div>
        </div>
      </section>

      {showModal && <ModalBansos onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Hero;
