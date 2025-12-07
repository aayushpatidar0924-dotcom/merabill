import React, { useEffect, useState, useMemo } from "react";
import WorkerNavbar from "./WorkerNavbar";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./worker.css";

// Helper functions
function getMonthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function lastNMonthsKeys(n = 6) {
  const arr = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return arr;
}

export default function WorkerDashboard() {
  const { t } = useTranslation();
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const workerId = savedUser?._id;

  const [worker, setWorker] = useState(null);
  const [workerBills, setWorkerBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedAdminsList, setAcceptedAdminsList] = useState([]);
  const [pendingRequestsList, setPendingRequestsList] = useState([]);

  // Fetch worker profile + bills
  useEffect(() => {
    if (!workerId) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const [profileRes, billsRes] = await Promise.all([
          axios.get(`http://localhost:5000/profile/${workerId}`),
          axios.get(`http://localhost:5000/bills/${workerId}`)
        ]);

        const user = profileRes.data.user || {};
        const bills = billsRes.data.bills || [];

        console.log("Fetched Worker:", user);
        console.log("Fetched Bills:", bills);

        setWorker(user);
        setWorkerBills(bills);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (err) {
        console.error("Worker Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workerId]);

  // Fetch admin details for pending & accepted
  useEffect(() => {
    if (!worker) {
      setAcceptedAdminsList([]);
      setPendingRequestsList([]);
      return;
    }

    const sent = (worker.requestSentTo || []).map(String);
    const accepted = (worker.acceptedAdmins || []).map(String);

    if (sent.length === 0 && accepted.length === 0) {
      setAcceptedAdminsList([]);
      setPendingRequestsList([]);
      return;
    }

    const allIds = Array.from(new Set([...sent, ...accepted]));

    const fetchAdminsByIds = async () => {
      try {
        const res = await axios.post("http://localhost:5000/get-admin-details", { ids: allIds });
        if (res.data.success) {
          const admins = res.data.admins || [];
          const byId = admins.reduce((acc, a) => {
            acc[String(a._id)] = a;
            return acc;
          }, {});

          setAcceptedAdminsList(
            accepted.map(id => byId[id]).filter(Boolean)
          );
          setPendingRequestsList(
            sent.filter(id => !accepted.includes(id)).map(id => byId[id]).filter(Boolean)
          );
        } else {
          setAcceptedAdminsList([]);
          setPendingRequestsList([]);
        }
      } catch (err) {
        console.error("Error fetching admins by IDs:", err);
        setAcceptedAdminsList([]);
        setPendingRequestsList([]);
      }
    };

    fetchAdminsByIds();
  }, [worker]);

  // Accept request
  const handleAccept = async (adminId) => {
    try {
      const res = await axios.post("http://localhost:5000/accept-request", { workerId, adminId });
      if (res.data.success) {
        const newAccepted = Array.from(new Set([...(worker.acceptedAdmins || []).map(String), String(adminId)]));
        const newSent = (worker.requestSentTo || []).map(String).filter(id => id !== String(adminId));
        const updatedWorker = { ...worker, acceptedAdmins: newAccepted, requestSentTo: newSent };
        setWorker(updatedWorker);
        localStorage.setItem("user", JSON.stringify(updatedWorker));
      }
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  // Remove admin
  const handleRemove = async (adminId) => {
    try {
      const res = await axios.post("http://localhost:5000/remove-admin", { workerId, adminId });
      if (res.data.success) {
        const newAccepted = (worker.acceptedAdmins || []).map(String).filter(id => id !== String(adminId));
        const updatedWorker = { ...worker, acceptedAdmins: newAccepted };
        setWorker(updatedWorker);
        localStorage.setItem("user", JSON.stringify(updatedWorker));
      }
    } catch (err) {
      console.error("Error removing admin:", err);
    }
  };

  const months = lastNMonthsKeys(6);

  const monthlyCounts = useMemo(() => {
    const base = months.reduce((acc, m) => ({ ...acc, [m]: 0 }), {});
    workerBills.forEach(b => {
      const k = getMonthKey(new Date(b.date || b.createdAt));
      if (base[k] !== undefined) base[k]++;
    });
    return months.map(m => ({ month: m, count: base[m] }));
  }, [workerBills, months]);

  const last5 = useMemo(() => {
    return workerBills
      .slice()
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 5);
  }, [workerBills]);

  if (!workerId) return (
    <>
      <WorkerNavbar />
      <h3 style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        {t("Please login as worker.")}
      </h3>
    </>
  );

  if (loading) return (
    <>
      <WorkerNavbar />
      <div className="admin-loading">{t("Loading dashboard...")}</div>
    </>
  );

  return (
    <>
      <WorkerNavbar />
      <div className="admin-dashboard">
        {/* PROFILE + CHART */}
        <div className="admin-top">
          <div className="admin-profile glass">
            <div className="profile-left">
              <img
                src={worker?.profileImage ? `http://localhost:5000/uploads/${worker.profileImage}` : "/default-user.png"}
                alt="worker"
                className="profile-avatar"
              />
            </div>
            <div className="profile-right">
              <h2 className="admin-name">{worker?.name || t("Worker")}</h2>
              <p className="admin-org">{worker?.organization}</p>
              <div className="profile-stats">
                <div className="stat mini glass">
                  <div className="stat-label">{t("Your Bills")}</div>
                  <div className="stat-value">{workerBills.length}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-card glass">
            <h3>{t("Your Activity (Last 6 Months)")}</h3>
            <div className="chart-area">
              <svg viewBox="0 0 600 160" className="bars-svg" preserveAspectRatio="none">
                {monthlyCounts.map((m, i) => {
                  const max = Math.max(1, ...monthlyCounts.map(v => v.count));
                  const barW = 600 / monthlyCounts.length;
                  const h = (m.count / max) * 120;
                  const x = i * barW + 10;
                  const y = 140 - h;
                  return (
                    <g key={m.month}>
                      <rect x={x} y={y} width={barW - 20} height={h} rx="8" className="bar-rect" />
                      <text x={x + (barW - 20) / 2} y={155} className="bar-label" textAnchor="middle">
                        {m.month.split("-")[1]}/{m.month.split("-")[0].slice(2)}
                      </text>
                      <text x={x + (barW - 20) / 2} y={y - 6} className="bar-value" textAnchor="middle">
                        {m.count}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* RECENT BILLS */}
        <div className="admin-mid">
          <div className="glass panel recent-panel" style={{ gridColumn: "1 / span 2" }}>
            <h3>{t("Recent Bills")}</h3>
            {!last5.length && <p>{t("No recent bills")}</p>}
            <div className="recent-list">
              {last5.map(b => (
                <div className="recent-item" key={b._id}>
                  <img className="recent-thumb" src={`http://localhost:5000/uploads/${b.billImage}`} alt="bill" />
                  <div>
                    <div className="recent-title">{b.type}</div>
                    <div className="recent-meta">
                      <span>{new Date(b.date || b.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>₹{b.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACCEPTED ADMINS */}
        <div className="glass panel">
          <h3>{t("Admins you accepted")}</h3>
          {acceptedAdminsList.length === 0 && <p>{t("No accepted admins")}</p>}
          <div className="admin-list">
            {acceptedAdminsList.map(admin => (
              <div key={admin._id} className="admin-card">
                <h4>{admin.name}</h4>
                <p>{admin.email}</p>
                <button onClick={() => handleRemove(admin._id)} className="remove-btn">{t("Remove")}</button>
              </div>
            ))}
          </div>
        </div>

        {/* PENDING ADMINS */}
        <div className="glass panel">
          <h3>{t("Admins who sent requests")}</h3>
          {pendingRequestsList.length === 0 && <p>{t("No pending requests")}</p>}
          <div className="admin-list">
            {pendingRequestsList.map(admin => (
              <div key={admin._id} className="admin-card">
                <h4>{admin.name}</h4>
                <p>{admin.email}</p>
                <button onClick={() => handleAccept(admin._id)} className="accept-btn">{t("Accept")}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
