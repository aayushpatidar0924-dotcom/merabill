import React, { useState } from "react";
import { motion } from "framer-motion";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Login successful!");
        console.log("User:", data.user);

        // 🌟 Redirect based on role
        if (data.user.role === "manager" || data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("⚠️ Server connection error");
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
        <h1>Welcome Back 👋</h1>
        <p>Login to your MeraBill account</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            whileFocus={{ scale: 1.03 }}
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            whileFocus={{ scale: 1.03 }}
          />
          <motion.button
            type="submit"
            className="login-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login 🚀
          </motion.button>
        </form>

        <p className="login-switch">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default Login;
