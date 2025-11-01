import React from "react";
import { motion } from "framer-motion";
import "./login.css";
import { Link } from "react-router-dom";

function Login() {
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

        <form className="login-form">
          <motion.input
            type="email"
            placeholder="Email"
            required
            whileFocus={{ scale: 1.03 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            required
            whileFocus={{ scale: 1.03 }}
          />
          <motion.button
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
