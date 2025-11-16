import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [errorMessage, setErrorMessage] = useState("");
  const [inputError, setInputError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Remove error on typing
    setInputError(false);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInputError(false);

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        // ⬅ USER DATA SAVE IN LOCAL STORAGE
        localStorage.setItem("user", JSON.stringify(data.user));

        // Role based navigation
        if (data.user.role === "manager" || data.user.role === "admin") {
          navigate("/admin");
        } else if (data.user.role === "worker") {
          navigate("/worker");
        } else {
          navigate("/");
        }
      } else {
        setErrorMessage("❌ Email or Password is incorrect");
        setInputError(true);
      }
    } catch (err) {
      setErrorMessage("⚠️ Server connection error");
      console.error(err);
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="login-card"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1>{t("Welcome Back 👋")}</h1>
        <p>{t("Login to your MeraBill account")}</p>

        {/* ❌ ERROR MESSAGE */}
        {errorMessage && (
          <p className="login-error-message">{errorMessage}</p>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <motion.input
            type="email"
            name="email"
            placeholder={t("Email")}
            required
            onChange={handleChange}
            className={inputError ? "input-error" : ""}
            whileFocus={{ scale: 1.03 }}
          />

          <motion.input
            type="password"
            name="password"
            placeholder={t("Password")}
            required
            onChange={handleChange}
            className={inputError ? "input-error" : ""}
            whileFocus={{ scale: 1.03 }}
          />

          <motion.button
            type="submit"
            className="login-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("Login")}
          </motion.button>
        </form>

        <p className="login-switch">
          {t("Don’t have an account?")}{" "}
          <Link to="/signup">{t("Sign Up")}</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default Login;
