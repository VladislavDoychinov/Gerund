import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../Header.css";
import pulsePointLogo from "../image/pulsepoint.png";

interface CurrentUser {
  userId: number;
  email: string;
}

interface Notification {
  id: number;
  productName: string;
  buyerEmail: string;
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
    }
  };

  const loadNotifications = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/api/notifications",
        {
          withCredentials: true,
        },
      );
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
        { withCredentials: true },
      );

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to dismiss notification", error);
    }
  };

  const getButtonClass = (path: string) => {
    return location.pathname === path
      ? "mp-nav-btn mp-nav-btn--active"
      : "mp-nav-btn";
  };

  return (
    <>
      {notifications.length > 0 && (
        <div
          style={{
            padding: "10px",
            background: "#fff3cd",
            borderBottom: "1px solid #f0d98a",
          }}
        >
          {notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <span>
                {notification.buyerEmail} accepted your offer for{" "}
                {notification.productName}
              </span>
              <button onClick={() => dismissNotification(notification.id)}>
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      <header className="mp-header">
        <button
          type="button"
          className="mp-logo"
          onClick={() => navigate("/store")}
          aria-label="Go to marketplace"
        >
          <div className="mp-logo-icon">
            <img
              src={pulsePointLogo}
              alt="PulsePoint Logo"
              className="mp-logo-img"
            />
          </div>
          <span className="mp-logo-text">PulsePoint</span>
        </button>

        <nav className="mp-nav">
          <button
            className={getButtonClass("/home")}
            onClick={() => navigate("/home")}
          >
            Home
          </button>
          <button
            className={getButtonClass("/map")}
            onClick={() => navigate("/map")}
          >
            Map
          </button>
          <button
            className={getButtonClass("/store")}
            onClick={() => navigate("/store")}
          >
            Marketplace
          </button>
          <button
            className={getButtonClass("/addproduct")}
            onClick={() => navigate("/addproduct")}
          >
            Listing
          </button>
        </nav>

        {currentUser ? (
          <div className="mp-user-pill">
            <div className="mp-avatar">
              {currentUser.email.charAt(0).toUpperCase()}
            </div>
            <span>{currentUser.email}</span>
          </div>
        ) : (
          <button className="mp-login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </header>
    </>
  );
}
