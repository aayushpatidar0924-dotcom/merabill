import React, { useState } from "react";
import { motion } from "framer-motion";
import "./sign up.css";

function Signup() {
  const [role, setRole] = useState("manager");
  const [orgList] = useState([
    { id: 1, name: "Tech Solutions Pvt Ltd" },
    { id: 2, name: "Billing Hub India" },
    { id: 3, name: "Digital Accountz" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Signup successful as ${role.toUpperCase()}`);
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
          <motion.input type="text" placeholder="Full Name" required whileFocus={{ scale: 1.05 }} />
          <motion.input type="email" placeholder="Email Address" required whileFocus={{ scale: 1.05 }} />
          <motion.input type="tel" placeholder="Phone Number" required whileFocus={{ scale: 1.05 }} />
          <motion.input type="password" placeholder="Password" required whileFocus={{ scale: 1.05 }} />

          {role === "manager" && (
            <motion.input
              type="text"
              placeholder="Organization Name"
              required
              whileFocus={{ scale: 1.05 }}
            />
          )}

          {role === "worker" && (
            <motion.select required whileFocus={{ scale: 1.05 }}>
              <option value="">Select Organization</option>
              {orgList.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </motion.select>
          )}

          <motion.button className="signup-btn" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            Sign Up 🚀
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Signup;
