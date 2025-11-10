import React from "react";
import { motion } from "framer-motion";
import Billingdashboard from "../images/Billing dashboard.jpg";
import SmartReports from "../images/Smart Reports.jpg";
import Automation from "../images/Automation.jpg";
import BankLevelSecurity from "../images/BankLevelSecurity.jpg";
import "./home.css";

function Home() {
  return (
    <div className="home-container">
      {/*  Hero Section */}
    <motion.section
      className="hero"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Mera Bill
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Next-Gen Billing & Invoice Automation for Modern Organizations
          </motion.p>

        </div>
      </div>
    </motion.section>


      {/* Info Section */}
      <section className="info-section">
        <div className="info-text">
          <h2>Manage Everything in One Place</h2>
          <p>
            Track, generate, and analyze all your bills and invoices seamlessly.
            Mera Bill automates the boring part of your accounting — so you can
            focus on growth.
          </p>
        </div>
        <img
          src={Billingdashboard}
          alt="Billing dashboard"
        />
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <img src={SmartReports} alt="Smart Reports" />
          <h3>Smart Reports</h3>
          <p>AI-based insights for every transaction and client.</p>
        </div>
        <div className="feature-card">
          <img src={Automation} alt="Automation" />
          <h3>Automation</h3>
          <p>No manual entry — automate recurring invoices instantly.</p>
        </div>
        <div className="feature-card">
          <img src={BankLevelSecurity} alt="Security" />
          <h3>Bank-Level Security</h3>
          <p>Your data is encrypted and stored securely in the cloud.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
