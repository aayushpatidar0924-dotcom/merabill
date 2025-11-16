import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./signup.css";

function Signup() {
  const { t } = useTranslation();
  const [role, setRole] = useState("manager");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    organization: "",
  });

  // handle change for all fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = { ...formData, role };

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Signup successful!");
        e.target.reset();
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("⚠️ Server connection error");
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <motion.div
        className="signup-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="signup-title">{t("Create Your Account")}</h2>

        {/* Role Toggle */}
        <div className="role-toggle">
          <label>
            <input
              type="radio"
              name="role"
              value="manager"
              checked={role === "manager"}
              onChange={(e) => setRole(e.target.value)}
            />
            {t("Manager")}
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="worker"
              checked={role === "worker"}
              onChange={(e) => setRole(e.target.value)}
            />
            {t("Worker")}
          </label>
        </div>

        {/* Form Inputs */}
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder={t("Full Name")}
            required
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder={t("Email Address")}
            required
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder={t("Phone Number")}
            required
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder={t("Password")}
            required
            onChange={handleChange}
          />
          <input
            type="text"
            name="organization"
            placeholder={t("Organization / College Name")}
            required
            onChange={handleChange}
          />

          <button type="submit" className="signup-btn">
            {t("Sign Up 🚀")}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Signup;
