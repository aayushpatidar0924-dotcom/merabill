import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import WorkerNavbar from "./WorkerNavbar";
import { useTranslation } from "react-i18next";
import "./viewbill.css";

function ViewBill() {
  const { t } = useTranslation();

  const savedUser = useMemo(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  }, []);

  const role = savedUser?.role?.toLowerCase() || "";

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBillId, setEditingBillId] = useState(null);
  const [editData, setEditData] = useState({
    type: "",
    date: "",
    amount: "",
    billNumber: "",
  });

  const fetchBills = useCallback(() => {
    if (!savedUser || !savedUser._id) {
      setLoading(false);
      return;
    }
    setLoading(true);

    // ✅ Updated backend endpoint
    const url =
      role === "manager"
        ? `http://localhost:5000/bills/org/${savedUser._id}` // only adminId
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

  const handleDelete = (billId) => {
    if (!window.confirm(t("Are you sure you want to delete this bill?"))) return;

    axios
      .delete(`http://localhost:5000/bill/${billId}`)
      .then((res) => {
        if (res.data.success) {
          alert(t("Bill deleted successfully!"));
          fetchBills();
        }
      })
      .catch((err) => console.log(err));
  };

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
          alert(t("Bill updated successfully!"));
          setEditingBillId(null);
          fetchBills();
        }
      })
      .catch((err) => console.log(err));
  };

  const formatDate = (date) => {
    if (!date) return t("No Date");
    const d = new Date(date);
    if (isNaN(d.getTime())) return t("No Date");
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ⭐ Filter bills based on search
  const filteredBills = bills.filter((bill) => {
    const search = searchTerm.toLowerCase();
    return (
      bill.type?.toLowerCase().includes(search) ||
      bill.billNumber?.toString().includes(search) ||
      bill.amount?.toString().includes(search) ||
      formatDate(bill.date).toLowerCase().includes(search) ||
      (role === "manager" && bill.userId?.name?.toLowerCase().includes(search))
    );
  });

  if (loading)
    return (
      <h2 style={{ color: "white", textAlign: "center" }}>
        {t("Loading bills...")}
      </h2>
    );

  return (
    <>
      {role === "manager" ? <AdminNavbar /> : <WorkerNavbar />}

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder={t("Search bills")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="view-bill-container">
        {filteredBills.length === 0 ? (
          <h3 style={{ color: "white", textAlign: "center" }}>
            {t("No bills found.")}
          </h3>
        ) : (
          filteredBills.map((bill) => (
            <div key={bill._id} className="bill-card">
              <div className="bill-image-section">
                <img
                  src={`http://localhost:5000/uploads/${bill.billImage}`}
                  alt={t("Bill")}
                  className="bill-image"
                />
              </div>

              {role === "manager" && bill.userId && (
                <p className="worker-info">
                  <strong>{t("Uploaded By:")}</strong> {bill.userId.name}
                </p>
              )}

              {editingBillId === bill._id ? (
                <div className="bill-details">
                  <p><strong>{t("Type")}:</strong></p>
                  <input
                    name="type"
                    value={editData.type}
                    onChange={handleEditChange}
                  />
                  <p><strong>{t("Date")}:</strong></p>
                  <input
                    type="date"
                    name="date"
                    value={editData.date}
                    onChange={handleEditChange}
                  />
                  <p><strong>{t("Amount")}:</strong></p>
                  <input
                    type="number"
                    name="amount"
                    value={editData.amount}
                    onChange={handleEditChange}
                  />
                  <p><strong>{t("Bill No")}:</strong></p>
                  <input
                    name="billNumber"
                    value={editData.billNumber}
                    onChange={handleEditChange}
                  />
                  <button onClick={() => saveEdit(bill._id)} className="save-btn">
                    {t("Save")}
                  </button>
                  <button onClick={() => setEditingBillId(null)} className="cancel-btn">
                    {t("Cancel")}
                  </button>
                </div>
              ) : (
                <div className="bill-details">
                  <p><strong>{t("Type")}:</strong> {bill.type || t("N/A")}</p>
                  <p><strong>{t("Date")}:</strong> {formatDate(bill.date)}</p>
                  <p><strong>{t("Amount")}:</strong> ₹{bill.amount || 0}</p>
                  <p><strong>{t("Bill No")}:</strong> {bill.billNumber || t("N/A")}</p>
                  <button onClick={() => startEdit(bill)} className="edit-btn">
                    {t("Edit")}
                  </button>
                  <button onClick={() => handleDelete(bill._id)} className="delete-btn">
                    {t("Delete")}
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
