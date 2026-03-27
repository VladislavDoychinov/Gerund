import { useEffect, useState } from "react";
import { api } from "../api";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  useEffect(() => {
    document.title = "PulsePoint";
  }, []);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/login", { email, password }, { withCredentials: true });

      setMessage(response.data.message);

      localStorage.setItem("username", response.data.email);

      navigate("/home");

      setMessage(response.data.message);
      console.log("Logged in user:", response.data);

      setEmail("");
      setPassword("");

      navigate("/home");
    } catch (error: any) {
      if (error.response) {
        if (typeof error.response.data === "string") {
          setMessage("Error: " + error.response.data);
        } else {
          setMessage("Error: " + (error.response.data.message || "Login failed"));
        }
      } else {
        setMessage("Error: " + error.message);
      }
    }
  };

  return (
    <div className="acc_modal">
      <button
        type="button"
        className="acc-back-home-btn"
        title="Back to Home"
        aria-label="Back to Home"
        onClick={() => navigate("/home")}
      >
        <svg
          className="acc-back-home-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M14.7 5.3a1 1 0 0 1 0 1.4L10.41 11H20a1 1 0 1 1 0 2h-9.59l4.3 4.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.41 0Z" />
        </svg>
      </button>
      <form onSubmit={handleSubmit}>
        <h1>Log in to Your profile</h1>

        {message && <p className="status-message">{message}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="password-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Click here to sign up</Link>
      </p>
    </div>
  );
}