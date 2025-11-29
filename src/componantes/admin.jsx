import React, { useEffect, useMemo, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./admin.css";

function getMonthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
}

// Build last N month keys (latest last)
function lastNMonthsKeys(n = 6) {
  const keys = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return keys;
}

export default function Admin() {
  const { t } = useTranslation();

  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const adminId = savedUser?._id;
  const organization = savedUser?.organization;

  const [admin, setAdmin] = useState(null);
  const [adminBills, setAdminBills] = useState([]);
  const [orgBills, setOrgBills] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetch data
  useEffect(() => {
    if (!adminId || !organization) return;

    setLoading(true);
    setError("");

    const p1 = axios.get(`http://localhost:5000/profile/${adminId}`);
    const p2 = axios.get(`http://localhost:5000/bills/${adminId}`);
    const p3 = axios.get(`http://localhost:5000/bills/org/${organization}`);
    const p4 = axios.get(`http://localhost:5000/workers/${organization}`);

    Promise.all([p1, p2, p3, p4])
      .then(([r1, r2, r3, r4]) => {
        setAdmin(r1.data.user || {});
        setAdminBills(r2.data.bills || []);
        setOrgBills(r3.data.bills || []);
        setWorkersList(r4.data.workers || []);
      })
      .catch((err) => {
        console.error("Admin fetch error:", err);
        setError(t("Failed to load dashboard data. Check backend."));
      })
      .finally(() => setLoading(false));
  }, [adminId, organization, t]);

  // derived stats
  const workersCount = workersList.length;
  const adminBillsCount = adminBills.length;
  const orgBillsCount = orgBills.length;

  // last 5 bills (most recent first)
  const last5 = useMemo(() => {
    const all = orgBills
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      );
    return all.slice(0, 5);
  }, [orgBills]);

  // bill type counts
  const billTypeCounts = useMemo(() => {
    const map = {};
    orgBills.forEach((b) => {
      const t = b.type || "Unknown";
      map[t] = (map[t] || 0) + 1;
    });
    return map;
  }, [orgBills]);

  // monthly distribution for last 6 months
  const months = lastNMonthsKeys(6);
  const monthlyCounts = useMemo(() => {
    const counts = months.reduce((acc, k) => {
      acc[k] = 0;
      return acc;
    }, {});
    orgBills.forEach((b) => {
      const key = getMonthKey(b.date || b.createdAt || new Date());
      if (counts[key] !== undefined) counts[key]++;
    });
    return months.map((k) => ({ month: k, count: counts[k] || 0 }));
  }, [orgBills, months]);

  if (!adminId) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-page-empty">
          <h3>{t("Please login as admin and try again.")}</h3>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="admin-loading">{t("Loading dashboard...")}</div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />

      <div className="admin-dashboard">
        <div className="admin-top">
          <div className="admin-profile glass">
            <div className="profile-left">
              <img
                src={
                  admin?.profileImage
                    ? `http://localhost:5000/uploads/${admin.profileImage}`
                    : "/default-user.png"
                }
                alt="admin"
                className="profile-avatar"
              />
            </div>

            <div className="profile-right">
              <h2 className="admin-name">{admin?.name || t("Manager")}</h2>
              <p className="admin-org">{admin?.organization || organization}</p>

              <div className="profile-stats">
                <div className="stat mini glass">
                  <div className="stat-label">{t("Your Bills")}</div>
                  <div className="stat-value">{adminBillsCount}</div>
                </div>
                <div className="stat mini glass">
                  <div className="stat-label">{t("Workers")}</div>
                  <div className="stat-value">{workersCount}</div>
                </div>
                <div className="stat mini glass">
                  <div className="stat-label">{t("Org Bills")}</div>
                  <div className="stat-value">{orgBillsCount}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-card glass">
            <h3>{t("Bills in last 6 months")}</h3>
            <div className="chart-area">
              <svg
                viewBox="0 0 600 160"
                className="bars-svg"
                preserveAspectRatio="none"
              >
                {(() => {
                  const max = Math.max(1, ...monthlyCounts.map((m) => m.count));
                  const barW = 600 / monthlyCounts.length;
                  return monthlyCounts.map((m, i) => {
                    const h = (m.count / max) * 120;
                    const x = i * barW + 10;
                    const y = 140 - h;
                    return (
                      <g key={m.month}>
                        <rect
                          x={x}
                          y={y}
                          rx="8"
                          width={barW - 20}
                          height={h}
                          className="bar-rect"
                        />
                        <text
                          x={x + (barW - 20) / 2}
                          y={155}
                          textAnchor="middle"
                          className="bar-label"
                        >
                          {m.month.split("-")[1]}/{m.month.split("-")[0].slice(2)}
                        </text>
                        <text
                          x={x + (barW - 20) / 2}
                          y={y - 6}
                          textAnchor="middle"
                          className="bar-value"
                        >
                          {m.count}
                        </text>
                      </g>
                    );
                  });
                })()}
              </svg>
            </div>
          </div>
        </div>

        <div className="admin-mid">
          <div className="glass panel types-panel">
            <h3>{t("Bill Types")}</h3>
            <div className="types-list">
              {Object.keys(billTypeCounts).length === 0 && <p>{t("No bills yet")}</p>}
              {Object.entries(billTypeCounts).map(([type, cnt]) => (
                <div className="type-row" key={type}>
                  <div className="type-name">{type}</div>
                  <div className="type-count">{cnt}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass panel recent-panel">
            <h3>{t("Recent Bills")}</h3>
            {!last5.length && <p>{t("No recent bills")}</p>}
            <div className="recent-list">
              {last5.map((b) => (
                <div className="recent-item" key={b._id}>
                  <div className="recent-left">
                    <img
                      src={`http://localhost:5000/uploads/${b.billImage}`}
                      alt="bill"
                      className="recent-thumb"
                    />
                  </div>
                  <div className="recent-right">
                    <div className="recent-title">{b.type}</div>
                    <div className="recent-meta">
                      <span>{b.userId?.name || "—"}</span>
                      <span>•</span>
                      <span>{new Date(b.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>₹{b.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}
      </div>
    </>
  );
}
