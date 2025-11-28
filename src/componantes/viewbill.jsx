import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import WorkerNavbar from "./WorkerNavbar";
import "./viewbill.css";

function ViewBill() {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const role = savedUser?.role?.toLowerCase();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBillId, setEditingBillId] = useState(null);
  const [editData, setEditData] = useState({
    type: "",
    date: "",
    amount: "",
    billNumber: ""
  });

  /* ---------------------------
        FETCH BILLS 
  --------------------------- */
  const fetchBills = () => {
    if (!savedUser) return;
    setLoading(true);

    // ADMIN → Get all bills of organization
    if (role === "manager") {
      axios
        .get(`http://localhost:5000/bills/org/${savedUser.organization}`)
        .then((res) => {
          if (res.data.success) setBills(res.data.bills);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Error fetching org bills:", err);
          setLoading(false);
        });
      return;
    }

    // WORKER → Get only own bills
    axios
      .get(`http://localhost:5000/bills/${savedUser._id}`)
      .then((res) => {
        if (res.data.success) setBills(res.data.bills);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching bills:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBills();
  }, []);

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
      type: bill.type,
      date: bill.date,
      amount: bill.amount,
      billNumber: bill.billNumber,
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

  if (loading)
    return (
      <h2 style={{ color: "white", textAlign: "center" }}>
        Loading bills...
      </h2>
    );

  return (
    <>
      {role === "manager" && <AdminNavbar />}
      {role === "worker" && <WorkerNavbar />}

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

              {/* Admin sees worker name */}
              {role === "manager" && bill.userId && (
                <p className="worker-info">
                  <strong>Worker:</strong> {bill.userId.name}
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

                  <button
                    onClick={() => saveEdit(bill._id)}
                    className="save-btn"
                  >
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
                    <strong>Type:</strong> {bill.type}
                  </p>
                  <p>
                    <strong>Date:</strong> {bill.date}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{bill.amount}
                  </p>
                  <p>
                    <strong>Bill No:</strong> {bill.billNumber}
                  </p>

                  <button
                    onClick={() => startEdit(bill)}
                    className="edit-btn"
                  >
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
