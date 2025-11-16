import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./footer.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <motion.div className="footer-container">
        <div className="footer-brand">
          <h2>{t("Mera Bill")}</h2>
          <p>{t("Smart Billing. Simple Management. Total Control.")}</p>
        </div>

        <div className="footer-socials">
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaLinkedin /></a>
        </div>
      </motion.div>

      <motion.div className="footer-bottom">
        <p>© {new Date().getFullYear()} {t("Mera Bill")}. {t("All rights reserved.")}</p>
      </motion.div>
    </footer>
  );
}

export default Footer;
