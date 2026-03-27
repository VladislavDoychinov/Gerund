import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { api } from "../../api";
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

  // Auth modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // Register form
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regMessage, setRegMessage] = useState("");

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

  const openLoginModal = () => {
    setLoginEmail("");
    setLoginPassword("");
    setLoginMessage("");
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const openRegisterModal = () => {
    setRegUsername("");
    setRegEmail("");
    setRegPassword("");
    setRegMessage("");
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/api/auth/login",
        { email: loginEmail, password: loginPassword },
        { withCredentials: true },
      );
      setLoginMessage(response.data.message);
      setShowLoginModal(false);
      loadCurrentUser();
    } catch (error: any) {
      if (error.response) {
        setLoginMessage(
          "Error: " +
            (typeof error.response.data === "string"
              ? error.response.data
              : error.response.data.message || "Login failed"),
        );
      } else {
        setLoginMessage("Error: " + error.message);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, password: regPassword }),
      });
      const text = await response.text();
      if (response.ok) {
        setRegMessage("Success: " + text);
        setRegEmail("");
        setRegPassword("");
        setRegUsername("");
      } else {
        setRegMessage("Error: " + text);
      }
    } catch (err) {
      setRegMessage("Could not connect to the server.");
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
          <div className="mp-user-actions">
            <button
              type="button"
              className="mp-account-btn"
              onClick={() => navigate(`/account/${encodeURIComponent(currentUser.email)}`)}
            >
              My Account
            </button>
            <div className="mp-user-pill">
              <div className="mp-avatar">
                {currentUser.email.charAt(0).toUpperCase()}
              </div>
              <span>{currentUser.email}</span>
            </div>
          </div>
        ) : (
          <button className="mp-login-btn" onClick={openLoginModal}>
            Login
          </button>
        )}
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="auth-modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setShowLoginModal(false)} aria-label="Close">✕</button>
            <h2>Log in to Your Profile</h2>
            {loginMessage && <p className="auth-modal-message">{loginMessage}</p>}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoFocus
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
            <p>
              Don't have an account?{" "}
              <span className="auth-modal-switch" onClick={openRegisterModal}>
                Sign up
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="auth-modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setShowRegisterModal(false)} aria-label="Close">✕</button>
            <h2>Create an Account</h2>
            {regMessage && <p className="auth-modal-message">{regMessage}</p>}
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username (Optional)"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
              <div className="auth-password-field">
                <input
                  type={showRegPassword ? "text" : "password"}
                  placeholder="Password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
                <span className="auth-eye" onClick={() => setShowRegPassword(!showRegPassword)}>
                  <FontAwesomeIcon icon={showRegPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              <button type="submit">Register</button>
            </form>
            <p>
              Already have an account?{" "}
              <span className="auth-modal-switch" onClick={openLoginModal}>
                Log in
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
