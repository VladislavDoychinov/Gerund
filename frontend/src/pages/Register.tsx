import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  useEffect(() => {
    document.title = "Create Account";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          email,
          password,
          username,
        },
      );

      setMessage("Success: " + response.data);
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (err: any) {
      if (err.response) {
        setMessage("Error: " + err.response.data);
      } else {
        setMessage("Could not connect to the server.");
        console.error("Axios error:", err);
      }
    }
  };

  return (
    <div className="acc_modal">
      <h1>Create an account</h1>

      {message && <p className="status-message">{message}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username (Optional)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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

export default Register;
