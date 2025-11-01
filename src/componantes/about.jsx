import React from "react";
import { motion } from "framer-motion";
import "./about.css";
import invoiceImage from "../images/invoice-laptop.jpg";

function About() {
  return (
    <section className="about">
      <motion.div
        className="about-content"
        initial={{ opacity: 0, x: -120 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Mera Bill
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <strong>Mera Bill</strong> is a smart billing and invoice management web
          app built for organizations and startups. It automates billing,
          tracks transactions, and keeps your accounts up to date with
          next-gen analytics and security.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Our platform is designed to simplify complex finance workflows so you
          can focus on what really matters — growing your business with
          confidence and clarity.
        </motion.p>
      </motion.div>

      
      <motion.div
        className="about-image"
        initial={{ opacity: 0, x: 120 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src={invoiceImage}
          alt="Billing management"
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>

      <motion.div
        className="about-cards"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {[
          {
            title: "Our Mission",
            text: "To make billing simple, transparent, and automated for every business — big or small.",
          },
          {
            title: "Our Vision",
            text: "To be India’s most trusted billing and finance automation platform by empowering organizations digitally.",
          },
          {
            title: "Why Choose Us",
            text: "Seamless UI, real-time analytics, and cloud security — all in one powerful billing ecosystem.",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            className="about-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default About;
