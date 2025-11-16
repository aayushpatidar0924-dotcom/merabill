import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import WorkerNavbar from "./WorkerNavbar";
import axios from "axios";
import "./profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [previewImg, setPreviewImg] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) return;

    const parsed = JSON.parse(savedUser);
    setUser(parsed);
    setUpdatedUser(parsed);

    // Fetch fresh data from backend
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

  // Handle input change
  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImg(URL.createObjectURL(file));
      uploadProfilePhoto(file);
    }
  };

  // Upload profile photo
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

  // Save updated profile
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

  if (!user) return <h2 style={{ color: "white" }}>Loading...</h2>;
console.log("CURRENT USER ROLE:", user.role);

  return (
    <>
    {user.role === "manager" && <AdminNavbar />}
    {user.role === "worker" && <WorkerNavbar />}

    <div className="profile-container">
      
      <div className="profile-card">
        <h2 className="profile-title">User Profile</h2>

        <div className="profile-image-section">
          <img
            src={
              previewImg ||
              (user.profileImage
                ? `http://localhost:5000/uploads/${user.profileImage}`
                : "https://via.placeholder.com/150")
            }
            alt="Profile"
            className="profile-image"
          />
          {editMode && (
            <input type="file" accept="image/*" onChange={handleImageChange} />
          )}
        </div>

        <div className="profile-info">
          <label>Name</label>
          {editMode ? (
            <input
              name="name"
              value={updatedUser.name}
              onChange={handleChange}
            />
          ) : (
            <p>{user.name}</p>
          )}

          <label>Email</label>
          <p>{user.email}</p>

          <label>Phone</label>
          {editMode ? (
            <input
              name="phone"
              value={updatedUser.phone}
              onChange={handleChange}
            />
          ) : (
            <p>{user.phone}</p>
          )}

          <label>Organization</label>
          {editMode ? (
            <input
              name="organization"
              value={updatedUser.organization}
              onChange={handleChange}
            />
          ) : (
            <p>{user.organization}</p>
          )}

          <label>Role</label>
          <p>{user.role}</p>
        </div>

        <div className="profile-buttons">
          {editMode ? (
            <>
              <button className="save-btn" onClick={saveProfile}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Profile;
