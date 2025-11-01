import React from "react";
import { motion } from "framer-motion";
import "./contact.css";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  return (
    <motion.div
      className="contact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Header Section */}
      <motion.h1
        className="contact-heading"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Get in Touch ✨
      </motion.h1>
      <p className="contact-subtitle">
        We’d love to hear from you — let’s make billing simple together!
      </p>

      {/* Contact Info Section */}
      <motion.div
        className="contact-info"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} className="info-card">
          <FaEnvelope className="info-icon" />
          <h3>Email</h3>
          <p>merabill123@gmail.com</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="info-card">
          <FaPhoneAlt className="info-icon" />
          <h3>Phone</h3>
          <p>1234567890</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="info-card">
          <FaMapMarkerAlt className="info-icon" />
          <h3>Address</h3>
          <p>XYZ, India</p>
        </motion.div>
      </motion.div>

      {/* Help Form Section */}
      <motion.div
        className="help-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h2>Need Help? 💬</h2>
        <p>Tell us your issue — we’ll respond quickly!</p>

        <form className="help-form">
          <motion.input
            type="text"
            placeholder="Your Name"
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="email"
            placeholder="Your Email"
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.textarea
            rows="4"
            placeholder="Describe your issue..."
            required
            whileFocus={{ scale: 1.02 }}
          ></motion.textarea>

          <motion.button
            className="send-btn"
            whileHover={{ scale: 1.05, backgroundColor: "#ff7eb3" }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message 🚀
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default Contact;
