import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./nav_bar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4762/4762314.png"
          alt="Mera Bill Logo"
        />
        <h2>{t("Mera Bill")}</h2>
      </div>

      {/* Menu Icon for Mobile */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <ul className={menuOpen ? "active" : ""}>
        <li><Link to="/">{t("Home")}</Link></li>
        <li><Link to="/about">{t("About")}</Link></li>
        <li><Link to="/contact">{t("Contact")}</Link></li>
        <li><Link to="/login">{t("Login")}</Link></li>
        <li><Link to="/signup">{t("Sign Up")}</Link></li>

        {/*  Language Switcher */}
        <li className="language-select">
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            defaultValue={i18n.language}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
