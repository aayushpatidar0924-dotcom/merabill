import React from "react";
import AdminNavbar from "./AdminNavbar";

function Admin() {
  return (
    <>
      <AdminNavbar />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Welcome, Manager 👨‍💼</h1>
        <p>This is the Admin Dashboard.</p>
      </div>
    </>
  );
}

export default Admin;
