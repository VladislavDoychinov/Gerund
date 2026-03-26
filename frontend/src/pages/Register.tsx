import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  useEffect(() => {
    document.title = "Create Account";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

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

      if (response.ok) {
        const data = await response.text();
        setMessage("Success: " + data);
        setEmail("");
        setPassword("");
      } else {
        const error = await response.text();
        setMessage("Error: " + error);
      }
    } catch (err) {
      setMessage("Could not connect to the server.");
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="acc_modal">
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
        Already have an account? <Link to="/login">Click here to login</Link>
      </p>
    </div>
  );
}