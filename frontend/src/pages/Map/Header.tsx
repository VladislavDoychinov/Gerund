import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  return (
    <header className="mp-header">
      <div className="mp-logo">
        <div className="mp-logo-icon">
          <FontAwesomeIcon icon={faMap} />
        </div>
        <span className="mp-logo-text">PulsePoint</span>
      </div>

      <nav className="mp-nav">
        <button className="mp-nav-btn" onClick={() => navigate("/home")}>
          Home
        </button>
        <button
          className="mp-nav-btn mp-nav-btn--active"
          onClick={() => navigate("/map")}
        >
          Map
        </button>
        <button className="mp-nav-btn" onClick={() => navigate("/marketplace")}>
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
