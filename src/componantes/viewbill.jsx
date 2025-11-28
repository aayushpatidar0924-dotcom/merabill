import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import WorkerNavbar from "./WorkerNavbar";
import "./viewbill.css";

function ViewBill() {
  // savedUser ko useMemo me wrap
  const savedUser = useMemo(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  }, []);

  const role = savedUser?.role?.toLowerCase() || "";

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBillId, setEditingBillId] = useState(null);
  const [editData, setEditData] = useState({
    type: "",
    date: "",
    amount: "",
    billNumber: "",
  });

  /* ---------------------------
        FETCH BILLS
  --------------------------- */
  const fetchBills = useCallback(() => {
    if (!savedUser || !savedUser._id) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const url =
      role === "manager"
        ? `http://localhost:5000/bills/org/${savedUser.organization}`
        : `http://localhost:5000/bills/${savedUser._id}`;

    axios
      .get(url)
      .then((res) => {
        if (res.data.success) setBills(res.data.bills);
        else setBills([]);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching bills:", err);
        setBills([]);
        setLoading(false);
      });
  }, [savedUser, role]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  /* ---------------------------
        DELETE BILL
  --------------------------- */
  const handleDelete = (billId) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;

    axios
      .delete(`http://localhost:5000/bill/${billId}`)
      .then((res) => {
        if (res.data.success) {
          alert("Bill deleted successfully!");
          fetchBills();
        }
      })
      .catch((err) => console.log(err));
  };

  /* ---------------------------
        EDIT BILL
  --------------------------- */
  const startEdit = (bill) => {
    setEditingBillId(bill._id);
    setEditData({
      type: bill.type || "",
      date: bill.date ? bill.date.slice(0, 10) : "",
      amount: bill.amount || "",
      billNumber: bill.billNumber || "",
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = (billId) => {
    axios
      .put(`http://localhost:5000/bill/${billId}`, editData)
      .then((res) => {
        if (res.data.success) {
          alert("Bill updated successfully!");
          setEditingBillId(null);
          fetchBills();
        }
      })
      .catch((err) => console.log(err));
  };

  /* ---------------------------
        FORMAT DATE
  --------------------------- */
  const formatDate = (date) => {
    if (!date) return "No Date";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "No Date";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <h2 style={{ color: "white", textAlign: "center" }}>
        Loading bills...
      </h2>
    );

  return (
    <>
      {role === "manager" ? <AdminNavbar /> : <WorkerNavbar />}

      <div className="view-bill-container">
        {bills.length === 0 ? (
          <h3 style={{ color: "white", textAlign: "center" }}>
            No bills uploaded yet.
          </h3>
        ) : (
          bills.map((bill) => (
            <div key={bill._id} className="bill-card">
              <div className="bill-image-section">
                <img
                  src={`http://localhost:5000/uploads/${bill.billImage}`}
                  alt="Bill"
                  className="bill-image"
                />
              </div>

              {role === "manager" && bill.userId && (
                <p className="worker-info">
                  <strong>Uploaded By:</strong> {bill.userId.name}
                </p>
              )}

              {editingBillId === bill._id ? (
                <div className="bill-details">
                  <input
                    name="type"
                    value={editData.type}
                    onChange={handleEditChange}
                  />
                  <input
                    type="date"
                    name="date"
                    value={editData.date}
                    onChange={handleEditChange}
                  />
                  <input
                    type="number"
                    name="amount"
                    value={editData.amount}
                    onChange={handleEditChange}
                  />
                  <input
                    name="billNumber"
                    value={editData.billNumber}
                    onChange={handleEditChange}
                  />

                  <button onClick={() => saveEdit(bill._id)} className="save-btn">
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBillId(null)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="bill-details">
                  <p>
                    <strong>Type:</strong> {bill.type || "N/A"}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(bill.date)}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{bill.amount || 0}
                  </p>
                  <p>
                    <strong>Bill No:</strong> {bill.billNumber || "N/A"}
                  </p>

                  

                  <button onClick={() => startEdit(bill)} className="edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bill._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ViewBill;
