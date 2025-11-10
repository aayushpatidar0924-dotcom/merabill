import React from "react";
import { Link } from "react-router-dom";
// import "./admin_nav.css";

function AdminNavbar() {
  return (
    <nav className="admin-navbar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;
