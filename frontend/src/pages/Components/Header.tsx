import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const location = useLocation();
  const username = localStorage.getItem("username");

  const getButtonClass = (path: string) => {
    return location.pathname === path
      ? "mp-nav-btn mp-nav-btn--active"
      : "mp-nav-btn";
  };

  return (
    <header className="mp-header">
      <div className="mp-logo">
        <div className="mp-logo-icon">
          <img alt="PulsePoint Logo" className="mp-logo-img" />
        </div>
        <span className="mp-logo-text">PulsePoint</span>
      </div>

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
      </nav>

      {username ? (
        <div className="mp-user-pill">
          <div className="mp-avatar">{username.charAt(0).toUpperCase()}</div>
          <span>{username}</span>
        </div>
      ) : (
        <button className="mp-login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      )}
    </header>
  );
}
