import { useNavigate, useLocation } from "react-router-dom";
import "../Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");

  const isActive = (path: string) => location.pathname === path;

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
          className={`mp-nav-btn ${isActive("/home") ? "mp-nav-btn--active" : ""}`}
          onClick={() => navigate("/home")}
        >
          Home
        </button>
        <button
          className={`mp-nav-btn ${isActive("/map") ? "mp-nav-btn--active" : ""}`}
          onClick={() => navigate("/map")}
        >
          Map
        </button>
        <button
          className={`mp-nav-btn ${isActive("/store") ? "mp-nav-btn--active" : ""}`}
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