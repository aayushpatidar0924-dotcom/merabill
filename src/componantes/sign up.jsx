import React, { useState } from "react";
import { motion } from "framer-motion";
import "./signup.css";

function Signup() {
  const [role, setRole] = useState("manager");
  const [orgList] = useState([
    { id: 1, name: "Tech Solutions Pvt Ltd" },
    { id: 2, name: "Billing Hub India" },
    { id: 3, name: "Digital Accountz" },
    { id: 4, name: "JIT Borawan" },
  ]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    organization: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("🎉 Signup successful!");
        window.location.href = "/login";
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("⚠️ Error connecting to server");
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <motion.div
        className="signup-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="signup-title">Create Your Account</h2>

        <div className="role-toggle">
          <label>
            <input
              type="radio"
              value="manager"
              checked={role === "manager"}
              onChange={(e) => setRole(e.target.value)}
            />
            Manager
          </label>
          <label>
            <input
              type="radio"
              value="worker"
              checked={role === "worker"}
              onChange={(e) => setRole(e.target.value)}
            />
            Worker
          </label>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <motion.input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            whileFocus={{ scale: 1.05 }}
          />
          <motion.input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
            whileFocus={{ scale: 1.05 }}
          />
          <motion.input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            onChange={handleChange}
            whileFocus={{ scale: 1.05 }}
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            whileFocus={{ scale: 1.05 }}
          />

          {role === "manager" && (
            <motion.input
              type="text"
              name="organization"
              placeholder="Organization Name"
              required
              onChange={handleChange}
              whileFocus={{ scale: 1.05 }}
            />
          )}

          {role === "worker" && (
            <motion.select
              name="organization"
              required
              onChange={handleChange}
              whileFocus={{ scale: 1.05 }}
            >
              <option value="">Select Organization</option>
              {orgList.map((org) => (
                <option key={org.id} value={org.name}>
                  {org.name}
                </option>
              ))}
            </motion.select>
          )}

          <motion.button
            className="signup-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up 🚀
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Signup;
