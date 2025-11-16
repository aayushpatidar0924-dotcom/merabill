import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import "./workers.css";

function Workers({ organization }) {
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/workers/${organization}`);
        const data = await res.json();

        if (data.success) {
          setWorkers(data.workers);
        } else {
          setError("Failed to load workers");
        }
      } catch (err) {
        console.error(err);
        setError("Server connection error");
      }
    };

    fetchWorkers();
  }, [organization]);

  return (
    <>
    <AdminNavbar />
    <div className="workers-page">
      <h1>👷 Workers of {organization}</h1>

      {error && <p className="error-text">{error}</p>}

      <div className="worker-list">
        {workers.length > 0 ? (
          workers.map((worker) => (
            <div key={worker._id} className="worker-card">
              <img
                src={
                  worker.billImage
                    ? `http://localhost:5000/uploads/${worker.billImage}`
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
          !error && <p>No workers found.</p>
        )}
      </div>
      
    </div>
    </>
  );
}

export default Workers;
