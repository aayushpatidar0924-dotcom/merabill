import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./contact.css";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  const { t } = useTranslation();

  // NEW STATES
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const message = e.target[2].value;

    // Clear previous messages
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(t("✅ Message sent successfully!"));
        e.target.reset();
      } else {
        setErrorMessage(t("❌ Failed to send message. Please try again later."));
      }
    } catch (err) {
      setErrorMessage(t("⚠️ Server error. Check your backend connection."));
    }
  };

  return (
    <motion.div className="contact-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.h1 className="contact-heading">{t("Get in Touch ✨")}</motion.h1>
      <p className="contact-subtitle">
        {t("We’d love to hear from you — let’s make billing simple together!")}
      </p>

      <div className="contact-info">
        <div className="info-card">
          <FaEnvelope className="info-icon" />
          <h3>{t("Email")}</h3>
          <p>merabill123@gmail.com</p>
        </div>
        <div className="info-card">
          <FaPhoneAlt className="info-icon" />
          <h3>{t("Phone")}</h3>
          <p>1234567890</p>
        </div>
        <div className="info-card">
          <FaMapMarkerAlt className="info-icon" />
          <h3>{t("Address")}</h3>
          <p>XYZ, India</p>
        </div>
      </div>

      <motion.div className="help-container">
        <h2>{t("Need Help? 💬")}</h2>
        <p>{t("Tell us your issue — we’ll respond quickly!")}</p>

        <form className="help-form" onSubmit={handleSubmit}>
          <input type="text" placeholder={t("Your Name")} required />
          <input type="email" placeholder={t("Your Email")} required />
          <textarea rows="4" placeholder={t("Describe your issue...")} required />
          <button type="submit" className="send-btn">{t("Send Message")}</button>
        </form>

        {/* SUCCESS / ERROR MESSAGE UI */}
        {successMessage && <p className="success-text">{successMessage}</p>}
        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </motion.div>
    </motion.div>
  );
}

export default Contact;
