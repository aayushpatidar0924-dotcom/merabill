import React, { useEffect, useState, useMemo } from "react";
import WorkerNavbar from "./WorkerNavbar";
import axios from "axios";
import "./admin.css"; // SAME DESIGN USE HO RHA HAI

// Get YYYY-MM
function getMonthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Last N months keys
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
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const workerId = savedUser?._id;

  const [worker, setWorker] = useState(null);
  const [workerBills, setWorkerBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workerId) return;

    setLoading(true);

    const p1 = axios.get(`http://localhost:5000/profile/${workerId}`);
    const p2 = axios.get(`http://localhost:5000/bills/${workerId}`);

    Promise.all([p1, p2])
      .then(([r1, r2]) => {
        setWorker(r1.data.user || {});
        setWorkerBills(r2.data.bills || []);
      })
      .catch((err) => console.error("Worker Dashboard Error:", err))
      .finally(() => setLoading(false));
  }, [workerId]);

  const months = lastNMonthsKeys(6);

  // Monthly chart
  const monthlyCounts = useMemo(() => {
    const base = months.reduce((acc, m) => {
      acc[m] = 0;
      return acc;
    }, {});

    workerBills.forEach((b) => {
      const k = getMonthKey(b.date || b.createdAt);
      if (base[k] !== undefined) base[k]++;
    });

    return months.map((m) => ({ month: m, count: base[m] }));
  }, [workerBills, months]);

  // Last 5 bills
  const last5 = useMemo(() => {
    const sorted = workerBills
      .slice()
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

    return sorted.slice(0, 5);
  }, [workerBills]);

  if (!workerId)
    return (
      <>
        <WorkerNavbar />
        <h3 style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
          Please login as worker.
        </h3>
      </>
    );

  if (loading)
    return (
      <>
        <WorkerNavbar />
        <div className="admin-loading">Loading dashboard...</div>
      </>
    );

  return (
    <>
      <WorkerNavbar />

      <div className="admin-dashboard">
        {/* ---------- TOP SECTION (Same as Admin) ---------- */}
        <div className="admin-top">
          {/* Profile Box */}
          <div className="admin-profile glass">
            <div className="profile-left">
              <img
                src={
                  worker?.profileImage
                    ? `http://localhost:5000/uploads/${worker.profileImage}`
                    : "/default-user.png"
                }
                alt="worker"
                className="profile-avatar"
              />
            </div>

            <div className="profile-right">
              <h2 className="admin-name">{worker?.name || "Worker"}</h2>
              <p className="admin-org">{worker?.organization}</p>

              <div className="profile-stats">
                <div className="stat mini glass">
                  <div className="stat-label">Your Bills</div>
                  <div className="stat-value">{workerBills.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="chart-card glass">
            <h3>Your Activity (Last 6 Months)</h3>
            <div className="chart-area">
              <svg viewBox="0 0 600 160" className="bars-svg" preserveAspectRatio="none">
                {(() => {
                  const max = Math.max(1, ...monthlyCounts.map((v) => v.count));
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
                          width={barW - 20}
                          height={h}
                          rx="8"
                          className="bar-rect"
                        />
                        <text
                          x={x + (barW - 20) / 2}
                          y={155}
                          className="bar-label"
                          textAnchor="middle"
                        >
                          {m.month.split("-")[1]}/{m.month.split("-")[0].slice(2)}
                        </text>
                        <text
                          x={x + (barW - 20) / 2}
                          y={y - 6}
                          className="bar-value"
                          textAnchor="middle"
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

        {/* ---------- MID ROW (Recent Bills Only for Worker) ---------- */}
        <div className="admin-mid">
          <div className="glass panel recent-panel" style={{ gridColumn: "1 / span 2" }}>
            <h3>Recent Bills</h3>

            {!last5.length && <p>No recent bills</p>}

            <div className="recent-list">
              {last5.map((b) => (
                <div className="recent-item" key={b._id}>
                  <img
                    className="recent-thumb"
                    src={`http://localhost:5000/uploads/${b.billImage}`}
                    alt="bill"
                  />

                  <div>
                    <div className="recent-title">{b.type}</div>

                    <div className="recent-meta">
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
      </div>
    </>
  );
}
