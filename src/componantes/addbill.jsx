import React, { useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import WorkerNavbar from "./WorkerNavbar";
import { useTranslation } from "react-i18next"; // <-- import
import "./addbill.css";

function AddBill() {
  const { t } = useTranslation(); // <-- translation hook

  const savedUser = JSON.parse(localStorage.getItem("user"));
  const role = savedUser?.role?.toLowerCase();

  const [billData, setBillData] = useState({
    billType: "",
    billDate: "",
    billAmount: "",
    billNumber: "",
  });

  const [billImage, setBillImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const handleChange = (e) => {
    setBillData({ ...billData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBillImage(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const uploadBill = async () => {
    if (!billImage) {
      alert(t("Please upload bill image!"));
      return;
    }

    const formData = new FormData();
    formData.append("billImage", billImage);
    formData.append("type", billData.billType);
    formData.append("date", billData.billDate);
    formData.append("amount", billData.billAmount);
    formData.append("billNumber", billData.billNumber);
    formData.append("userId", savedUser._id);

    try {
      const res = await axios.post(
        "http://localhost:5000/add-bill",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        alert(t("Bill uploaded successfully!"));
        setBillData({
          billType: "",
          billDate: "",
          billAmount: "",
          billNumber: "",
        });
        setBillImage(null);
        setPreviewImg(null);
      }
    } catch (error) {
      console.log("Upload error:", error);
      alert(t("Upload failed!"));
    }
  };

  return (
    <>
      {role === "manager" && <AdminNavbar />}
      {role === "worker" && <WorkerNavbar />}

      <div className="add-bill-container">
        <div className="add-bill-card">
          <h2>{t("Add New Bill")}</h2>

          <div className="bill-image-section">
            <img
              src={
                previewImg
                  ? previewImg
                  : "https://via.placeholder.com/200?text=Upload+Bill"
              }
              alt={t("Bill")}
              className="bill-preview"
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <label>{t("Bill Type")}</label>
          <select
            name="billType"
            value={billData.billType}
            onChange={handleChange}
          >
            <option value="">{t("Select Bill Type")}</option>
            <option value="Light Bill">{t("Light Bill")}</option>
            <option value="Petrol Pump Bill">{t("Petrol Pump Bill")}</option>
            <option value="Food Bill">{t("Food Bill")}</option>
            <option value="Shopping Bill">{t("Shopping Bill")}</option>
            <option value="Medical Bill">{t("Medical Bill")}</option>
            <option value="Transport Bill">{t("Transport Bill")}</option>
          </select>

          <label>{t("Date")}</label>
          <input
            type="date"
            name="billDate"
            value={billData.billDate}
            onChange={handleChange}
          />

          <label>{t("Amount")}</label>
          <input
            type="number"
            name="billAmount"
            placeholder={t("Enter amount")}
            value={billData.billAmount}
            onChange={handleChange}
          />

          <label>{t("Bill Number")}</label>
          <input
            name="billNumber"
            placeholder={t("Bill number")}
            value={billData.billNumber}
            onChange={handleChange}
          />

          <button className="upload-btn" onClick={uploadBill}>
            {t("Upload Bill")}
          </button>
        </div>
      </div>
    </>
  );
}

export default AddBill;
