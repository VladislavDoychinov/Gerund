import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import "./Profile.css";

interface UserInfo {
  username: string;
  email: string;
}

const EXAMPLE_USER: UserInfo = {
  username: "Demo User",
  email: "demo@example.com",
};

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo>(EXAMPLE_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/api/user");
        setUserInfo(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.log("Not logged in, showing example user");
        setUserInfo(EXAMPLE_USER);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <header className="profile-header">
          <h1>Profile</h1>
          <Link to="/main" className="back-button">
            ← Back
          </Link>
        </header>

        <main className="profile-content">
          {loading && (
            <div className="loading-state">
              <p>Loading...</p>
            </div>
          )}

          {!loading && (
            <>
              {!isLoggedIn && (
                <div className="debug-banner">
                  ℹ️ You're not logged in. Showing example user for debugging.
                </div>
              )}

              <div className="user-info-section">
                <div className="user-avatar">
                  <span>{userInfo.username[0].toUpperCase()}</span>
                </div>
                <div className="user-details">
                  <h2>{userInfo.username}</h2>
                  <p>{userInfo.email}</p>
                </div>
              </div>

              <div className="account-type-card">
                <h3>Account Type</h3>
                <p>Customer</p>
              </div>

              <div className="settings-section">
                <h3>Settings</h3>
                <div className="settings-buttons">
                  <button className="settings-button">
                    Edit Profile
                  </button>
                  <button className="settings-button">
                    Change Password
                  </button>
                  <button className="settings-button">
                    Privacy Settings
                  </button>
                  <button className="settings-button logout-button">
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
