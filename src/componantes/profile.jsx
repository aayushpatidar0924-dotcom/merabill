import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import WorkerNavbar from "./WorkerNavbar";
import axios from "axios";
import { useTranslation } from "react-i18next"; // <-- i18n import
import "./profile.css";

function Profile() {
  const { t } = useTranslation(); // <-- translation hook

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;
    const parsed = JSON.parse(savedUser);
    setUser(parsed);
    setUpdatedUser(parsed);

    axios
      .get(`http://localhost:5000/profile/${parsed._id}`)
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
          setUpdatedUser(res.data.user);
        }
      })
      .catch((err) => console.log("Profile fetch error:", err));
  }, []);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImg(URL.createObjectURL(file));
      uploadProfilePhoto(file);
    }
  };

  const uploadProfilePhoto = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await axios.put(
        `http://localhost:5000/profile/${user._id}/photo`,
        formData
      );
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
    } catch (error) {
      console.log("Photo upload error:", error);
    }
  };

  const saveProfile = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/profile/${user._id}`,
        updatedUser
      );
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        setUpdatedUser(res.data.user);
        setEditMode(false);
      }
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  if (!user) return <h2 style={{ color: "white" }}>{t("Loading...")}</h2>;

  return (
    <>
      {user.role === "manager" && <AdminNavbar />}
      {user.role === "worker" && <WorkerNavbar />}

      <div className="profile-container">
        <div className="profile-card">
          <h2 className="profile-title">{t("User Profile")}</h2>

          <div className="profile-image-section">
            <img
              src={
                previewImg ||
                (user.profileImage
                  ? `http://localhost:5000/uploads/${user.profileImage}`
                  : "https://via.placeholder.com/150")
              }
              alt={t("Profile")}
              className="profile-image"
            />
            {editMode && (
              <input type="file" accept="image/*" onChange={handleImageChange} />
            )}
          </div>

          <div className="profile-info">
            <label>{t("Name")}</label>
            {editMode ? (
              <input
                name="name"
                value={updatedUser.name}
                onChange={handleChange}
              />
            ) : (
              <p>{user.name}</p>
            )}

            <label>{t("Email")}</label>
            <p>{user.email}</p>

            <label>{t("Phone")}</label>
            {editMode ? (
              <input
                name="phone"
                value={updatedUser.phone}
                onChange={handleChange}
              />
            ) : (
              <p>{user.phone}</p>
            )}

            <label>{t("Organization")}</label>
            {editMode ? (
              <input
                name="organization"
                value={updatedUser.organization}
                onChange={handleChange}
              />
            ) : (
              <p>{user.organization}</p>
            )}

            <label>{t("Role")}</label>
            <p>{user.role}</p>
          </div>

          <div className="profile-buttons">
            {editMode ? (
              <>
                <button className="save-btn" onClick={saveProfile}>
                  {t("Save")}
                </button>
                <button className="cancel-btn" onClick={() => setEditMode(false)}>
                  {t("Cancel")}
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                {t("Edit Profile")}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
