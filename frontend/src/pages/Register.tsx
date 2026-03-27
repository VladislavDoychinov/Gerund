import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  useEffect(() => {
    document.title = "Create Account";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const text = await response.text();

      if (response.ok) {
        setMessage("Success: " + text);
        setEmail("");
        setPassword("");
      } else {
        setMessage("Error: " + text);
      }
    } catch (err) {
      setMessage("Could not connect to the server.");
      console.error("Fetch error:", err);
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
      <h1>Create an account</h1>

      {message && <p className="status-message">{message}</p>}

      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username (Optional)" />

        <input
          type="email"
          placeholder="E-mail"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span className="eye" onClick={() => setShowPassword(!showPassword)}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Click here to log in</Link>
      </p>
    </div>
  );
}

export default Register;