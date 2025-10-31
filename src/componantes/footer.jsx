import React from "react";
import { motion } from "framer-motion";
import "./footer.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <motion.div
        className="footer-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* 🔷 Left Section */}
        <div className="footer-brand">
          <h2>Mera Bill</h2>
          <p>Smart Billing. Simple Management. Total Control.</p>
        </div>

        {/* 🔶 Navigation Links */}
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/contact">Contact</a>
        </div>

        {/* 🌐 Social Media */}
        <div className="footer-socials">
          <motion.a whileHover={{ scale: 1.2 }} href="#">
            <FaFacebook />
          </motion.a>
          <motion.a whileHover={{ scale: 1.2 }} href="#">
            <FaInstagram />
          </motion.a>
          <motion.a whileHover={{ scale: 1.2 }} href="#">
            <FaTwitter />
          </motion.a>
          <motion.a whileHover={{ scale: 1.2 }} href="#">
            <FaLinkedin />
          </motion.a>
        </div>
      </motion.div>

      {/* 💫 Bottom Strip */}
      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>© {new Date().getFullYear()} Mera Bill. All rights reserved.</p>
      </motion.div>
    </footer>
  );
}

export default Footer;
