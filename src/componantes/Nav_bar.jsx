import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./nav_bar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4762/4762314.png"
          alt="Mera Bill Logo"
        />
        <h2>Mera Bill</h2>
      </div>

      {/* Menu Icon for Mobile */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <ul className={menuOpen ? "active" : ""}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/singup">Sing Up</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
