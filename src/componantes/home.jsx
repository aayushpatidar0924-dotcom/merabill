import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Billingdashboard from "../images/Billing dashboard.jpg";
import SmartReports from "../images/Smart Reports.jpg";
import Automation from "../images/Automation.jpg";
import BankLevelSecurity from "../images/BankLevelSecurity.jpg";
import "./home.css";

function Home() {
  const { t } = useTranslation();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <motion.h1>{t("Mera Bill")}</motion.h1>
            <motion.p>
              {t("Next-Gen Billing & Invoice Automation for Modern Organizations")}
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-text">
          <h2>{t("Manage Everything in One Place")}</h2>
          <p>
            {t(
              "Track, generate, and analyze all your bills and invoices seamlessly. Mera Bill automates the boring part of your accounting — so you can focus on growth."
            )}
          </p>
        </div>
        <img src={Billingdashboard} alt={t("Billing dashboard")} />
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <img src={SmartReports} alt="Smart Reports" />
          <h3>{t("Smart Reports")}</h3>
          <p>{t("AI-based insights for every transaction and client.")}</p>
        </div>
        <div className="feature-card">
          <img src={Automation} alt="Automation" />
          <h3>{t("Automation")}</h3>
          <p>{t("No manual entry — automate recurring invoices instantly.")}</p>
        </div>
        <div className="feature-card">
          <img src={BankLevelSecurity} alt="Security" />
          <h3>{t("Bank-Level Security")}</h3>
          <p>{t("Your data is encrypted and stored securely in the cloud.")}</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
