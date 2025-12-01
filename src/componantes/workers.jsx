import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { useTranslation } from "react-i18next";
import "./workers.css";

function Workers() {
  const { t } = useTranslation();
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState("");

  // ⭐ NEW: Search term for filtering workers
  const [searchTerm, setSearchTerm] = useState("");

  const savedUser = JSON.parse(localStorage.getItem("user"));
  const organization = savedUser?.organization;

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/workers/${organization}`);
        const data = await res.json();

        if (data.success) {
          setWorkers(data.workers);
        } else {
          setError(t("Failed to load workers"));
        }
      } catch (err) {
        console.error(err);
        setError(t("Server connection error"));
      }
    };

    if (organization) fetchWorkers();
  }, [organization, t]);

  // ⭐ Filter workers based on search term
  const filteredWorkers = workers.filter((worker) => {
    const s = searchTerm.toLowerCase();
    return (
      worker.name?.toLowerCase().includes(s) ||
      worker.email?.toLowerCase().includes(s) ||
      worker.phone?.toString().includes(s)
    );
  });

  return (
    <>
      <AdminNavbar />

      <div className="workers-page">
        <h1>👷 {t("Workers of")} {organization}</h1>

        {error && <p className="error-text">{error}</p>}

        {/* ⭐ NEW: Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder={t("Search workers")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="worker-list">
          {filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => (
              <div key={worker._id} className="worker-card">
                <img
                  src={
                    worker.profileImage
                      ? `http://localhost:5000/uploads/${worker.profileImage}`
                      : "/default-user.png"
                  }
                  alt={worker.name}
                />
                <h3>{worker.name}</h3>
                <p>{worker.email}</p>
                <p>{worker.phone}</p>
              </div>
            ))
          ) : (
            !error && <p>{t("No workers found.")}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Workers;
