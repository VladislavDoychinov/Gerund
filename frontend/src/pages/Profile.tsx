import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import "./Profile.css";

interface UserInfo {
  username: string;
  email: string;
  password: string;
}

const EXAMPLE_USER: UserInfo = {
  username: "Demo User",
  email: "demo@example.com",
  password: "",
};

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo>(EXAMPLE_USER);
  const [editingField, setEditingField] = useState<"username" | "email" | "password" | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/api/user");
        setUserInfo({
          ...EXAMPLE_USER,
          ...response.data,
        });
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

  const startEditing = (field: "username" | "email" | "password") => {
    setEditingField(field);
    setDraftValue(userInfo[field]);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setDraftValue("");
  };

  const saveEditing = () => {
    if (!editingField) {
      return;
    }

    setUserInfo((prev) => ({
      ...prev,
      [editingField]: draftValue,
    }));
    cancelEditing();
  };

  const PencilIcon = () => (
    <svg
      className="pencil-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.86 3.49a1.75 1.75 0 0 1 2.48 0l1.17 1.17a1.75 1.75 0 0 1 0 2.48l-11.7 11.7-3.85.7.7-3.85 11.2-11.2Zm1.06 1.41-1.06 1.06 1.17 1.17 1.06-1.06-1.17-1.17ZM15.8 7.37 6.68 16.5l-.32 1.76 1.76-.32 9.12-9.12-1.44-1.45Z" />
    </svg>
  );

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

              <div className="account-edit-card">
                <h3>Account Details</h3>

                <div className="editable-field-row">
                  <div className="field-content">
                    <span className="field-label">Username</span>
                    {editingField === "username" ? (
                      <input
                        type="text"
                        className="field-input"
                        value={draftValue}
                        onChange={(e) => setDraftValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span className="field-value">{userInfo.username}</span>
                    )}
                  </div>

                  {editingField === "username" ? (
                    <div className="field-actions">
                      <button className="field-action-button save" onClick={saveEditing}>
                        Save
                      </button>
                      <button className="field-action-button" onClick={cancelEditing}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="edit-icon-button"
                      onClick={() => startEditing("username")}
                      aria-label="Edit username"
                    >
                      <PencilIcon />
                    </button>
                  )}
                </div>

                <div className="editable-field-row">
                  <div className="field-content">
                    <span className="field-label">Email</span>
                    {editingField === "email" ? (
                      <input
                        type="email"
                        className="field-input"
                        value={draftValue}
                        onChange={(e) => setDraftValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span className="field-value">{userInfo.email}</span>
                    )}
                  </div>

                  {editingField === "email" ? (
                    <div className="field-actions">
                      <button className="field-action-button save" onClick={saveEditing}>
                        Save
                      </button>
                      <button className="field-action-button" onClick={cancelEditing}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="edit-icon-button"
                      onClick={() => startEditing("email")}
                      aria-label="Edit email"
                    >
                      <PencilIcon />
                    </button>
                  )}
                </div>

                <div className="editable-field-row">
                  <div className="field-content">
                    <span className="field-label">Password</span>
                    {editingField === "password" ? (
                      <input
                        type="password"
                        className="field-input"
                        value={draftValue}
                        onChange={(e) => setDraftValue(e.target.value)}
                        placeholder="Enter new password"
                        autoFocus
                      />
                    ) : (
                      <span className="field-value">******</span>
                    )}
                  </div>

                  {editingField === "password" ? (
                    <div className="field-actions">
                      <button className="field-action-button save" onClick={saveEditing}>
                        Save
                      </button>
                      <button className="field-action-button" onClick={cancelEditing}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="edit-icon-button"
                      onClick={() => startEditing("password")}
                      aria-label="Edit password"
                    >
                      <PencilIcon />
                    </button>
                  )}
                </div>
              </div>

              <div className="settings-section">
                <div className="settings-buttons">
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
