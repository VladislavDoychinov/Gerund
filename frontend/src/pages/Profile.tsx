import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

interface CurrentUser {
  userId: number;
  email: string;
}

interface NotificationItem {
  id: number;
  productName: string;
  buyerEmail: string;
}

export default function Profile() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 8000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const loadCurrentUser = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/auth/me", {
        withCredentials: true,
      });
      setCurrentUser(result.data);
    } catch (error) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/notifications", {
        withCredentials: true,
      });
      setNotifications(result.data);
    } catch (error) {
      setNotifications([]);
    }
  };

  const dismissNotification = async (id: number) => {
    try {
      await axios.put(
        `http://localhost:8080/api/notifications/${id}/seen`,
        {},
        { withCredentials: true }
      );

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to dismiss notification", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      navigate("/login");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          withCredentials: true,
        }
      );

      setPasswordMessage(response.data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (error: any) {
      setPasswordMessage(
        error.response?.data?.message || "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <header className="profile-header">
            <h1>Profile</h1>
            <Link to="/home" className="back-button">
              ← Back
            </Link>
          </header>

          <main className="profile-content">
            <div className="debug-banner">
              You are not logged in.
            </div>
            <button className="settings-button" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <header className="profile-header">
          <h1>Profile</h1>
          <Link to="/home" className="back-button">
            ← Back
          </Link>
        </header>

        <main className="profile-content">
          <div className="user-info-section">
            <div className="user-avatar">
              <span>{currentUser.email[0].toUpperCase()}</span>
            </div>

            <div className="user-details">
              <h2>{currentUser.email}</h2>
              <p>User ID: {currentUser.userId}</p>
            </div>
          </div>

          <div className="account-type-card">
            <h3>Account Type</h3>
            <p>Customer</p>
          </div>

          <div className="account-type-card">
            <h3>Notifications</h3>

            {notifications.length === 0 ? (
              <p>No new notifications.</p>
            ) : (
              <div className="settings-buttons">
                {notifications.map((notification) => (
                  <div key={notification.id} style={{ marginBottom: "10px" }}>
                    <p>
                      {notification.buyerEmail} accepted your offer for{" "}
                      {notification.productName}
                    </p>
                    <button
                      className="settings-button"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="settings-section">
            <h3>Settings</h3>
            <div className="settings-buttons">

              <button
                className="settings-button"
                onClick={() => {
                  setShowPasswordForm((prev) => !prev);
                  setPasswordMessage("");
                }}
              >
                Change Password
              </button>


              <button
                className="settings-button logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>

            {showPasswordForm && (
              <form
                onSubmit={handleChangePassword}
                style={{
                  marginTop: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {passwordMessage && (
                  <p style={{ margin: 0, fontWeight: 600 }}>{passwordMessage}</p>
                )}

                <button
                  type="submit"
                  className="settings-button"
                  disabled={changingPassword}
                >
                  {changingPassword ? "Saving..." : "Save New Password"}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}