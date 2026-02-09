import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Footer.css';
import twitter from '../assets/twitter.svg'; 
import ig from '../assets/ig.svg'; 
import yt from '../assets/yt.svg'; 


function Footer() {
  const socials = [
    { href: "https://x.com/KemensosRI", img: twitter, alt: "Twitter", color: "#1DA1F2" },
    { href: "https://www.instagram.com/kemensosri/", img: ig, alt: "Instagram", color: "#C13584" },
    { href: "https://www.youtube.com/@KementerianSosialRI", img: yt, alt: "YouTube", color: "#FF0000" },
  ];

  return (
    <footer id="footer" className="footer">
      <div className="footer-container">

        <motion.div
          className="footer-top"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Left */}
          <motion.div
            className="footer-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
           
            <p>
              Bantuan sosial adalah bantuan dari pemerintah atau lembaga tertentu kepada masyarakat yang membutuhkan untuk membantu memenuhi kebutuhan dasar dan meningkatkan kesejahteraan hidup.

            </p>
          </motion.div>

          {/* Right */}
          <motion.div
            className="footer-right"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <p className="footer-title">Media Sosial Kami</p>
            <div className="socials">
              {socials.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, backgroundColor: item.color }}
                  whileTap={{ scale: 0.95 }}
                  className="social-btn"
                >
                  <img src={item.img} alt={item.alt} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p>
            &copy; {new Date().getFullYear()} <span>KEMENSOS</span>
          </p>
        </motion.div>

      </div>
    </footer>
  );
}

export default Footer;
