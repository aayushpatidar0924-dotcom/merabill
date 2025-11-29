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
        <h2>{t("Worker")}</h2>
      </div>

      {/* Menu Icon for Mobile */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <ul className={menuOpen ? "active" : ""}>
        <li><Link to="/worker">{t("Home")}</Link></li>
        <li><Link to="/viewbill">{t("View Bills")}</Link></li>
        <li><Link to="/addbill">{t("Add Bills")}</Link></li>
        <li><Link to="/profile">{t("Profile")}</Link></li>
        <li><Link to="/">{t("Logout")}</Link></li>

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
