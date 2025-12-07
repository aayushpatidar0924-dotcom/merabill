import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { useTranslation } from "react-i18next";
import "./workers.css";
import axios from "axios";

function Workers() {
  const { t } = useTranslation();
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("your"); 

  const savedUser = JSON.parse(localStorage.getItem("user"));
  const organization = savedUser?.organization;
  const adminId = savedUser?._id;

  // Fetch workers
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/workers/${organization}`, {
          params: { filter, search: searchTerm, adminId }
        });

        if (res.data.success) {
          setWorkers(res.data.workers);
        } else {
          setError(t("Failed to load workers"));
        }
      } catch (err) {
        console.error(err);
        setError(t("Server connection error"));
      }
    };

    if (organization) fetchWorkers();
  }, [organization, filter, searchTerm, adminId, t]);

  // Handlers
  const handleSendRequest = async (workerId) => {
    try {
      await axios.post("http://localhost:5000/send-request", { workerId, adminId });
      // refresh list
      setWorkers(prev => prev.map(w => w._id === workerId ? { ...w, requestSentTo: [...w.requestSentTo, adminId] } : w));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveRequest = async (workerId) => {
    try {
      await axios.post("http://localhost:5000/remove-request", { workerId, adminId });
      setWorkers(prev => prev.map(w => w._id === workerId ? { ...w, requestSentTo: w.requestSentTo.filter(id => id !== adminId) } : w));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveWorker = async (workerId) => {
    try {
      await axios.post("http://localhost:5000/remove-admin", { workerId, adminId });
      setWorkers(prev => prev.filter(w => w._id !== workerId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="workers-page">
        <h1>👷 {t("Workers of")} {organization}</h1>

        {error && <p className="error-text">{error}</p>}

        {/* SEARCH + FILTER */}
        <div className="top-controls">
          <input
            type="text"
            placeholder={t("Search workers (name, email, phone...)")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="your">{t("Your Workers")}</option>
            <option value="new">{t("New Workers")}</option>
            <option value="pending">{t("Request Pending")}</option>
          </select>
        </div>

        {/* WORKERS LIST */}
        <div className="worker-list">
          {workers.length > 0 ? (
            workers.map((worker) => (
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

                {/* Buttons */}
                {filter === "new" && (
                  <button onClick={() => handleSendRequest(worker._id)}>
                    {t("Send Request")}
                  </button>
                )}

                {filter === "pending" && (
                  <button onClick={() => handleRemoveRequest(worker._id)}>
                    {t("Remove Request")}
                  </button>
                )}

                {filter === "your" && (
                  <button onClick={() => handleRemoveWorker(worker._id)}>
                    {t("Remove")}
                  </button>
                )}
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
