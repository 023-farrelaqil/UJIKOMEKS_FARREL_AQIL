import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Content.css'

import gambar1 from '../assets/bansos12.jpg';
import gambar2 from '../assets/bansos7.jpg';
import gambar3 from '../assets/bansos11.jpg';
import gambar4 from '../assets/bansos8.webp';

function Content() {
  const projectCards = [
    { image: gambar1, title: 'Rumah Layak Huni' },
    { image: gambar2, title: 'Pendidikan' },
    { image: gambar3, title: 'Bantuan Kesehatan' },
    { image: gambar4, title: 'Bantuan Makanan' },
  ];

  return (
    <section id="projects" className="content-section">
      
      {/* FEATURED PROJECTS */}
      <div className="content-header">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Proyek Unggulan
        </motion.h2>
      </div>

      <div className="content-grid">
        {projectCards.map((card, index) => (
          <motion.div
            className="project-card"
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <img src={card.image} alt={card.title} />
            <div className="overlay"></div>
            <h3 className="card-title">{card.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* ⬇️ TAMBAHKAN DI SINI */}
      <section className="about-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Siapa Kami
        </motion.h2>

        <motion.p
          className="about-text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Bantuan Sosial Pemerintah adalah program pemerintah Indonesia yang bertujuan membantu 
          masyarakat miskin dan rentan dalam memenuhi kebutuhan dasar serta meningkatkan kesejahteraan 
          sosial, khususnya bagi keluarga kurang mampu, anak-anak, perempuan, lansia, dan penyandang disabilitas.
        </motion.p>

        <div className="stats">
          <div>
            <h3>5</h3>
            <p>Jumlah Program Bantuan Sosial</p>
          </div>
          <div>
            <h3>±70–80 juta jiwa</h3>
            <p>Jumlah Penerima Manfaat</p>
          </div>
          <div>
            <h3>38 Provinsi</h3>
            <p>Jumlah Wilayah Tercakup</p>
          </div>
          <div>
            <h3>±21–23 juta rumah tangga</h3>
            <p>Jumlah Rumah Tangga Tercakup</p>
          </div>
        </div>
      </section>

    </section>
  );
}


export default Content;
