import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  useEffect(() => {
    document.title = "Create Account";
  }, []);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const payload = {
        username: username.trim() || null,
        email: email.trim(),
        password: password.trim(),
      };

      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const successMessage =
        typeof response.data === "string"
          ? response.data
          : response.data.message || "User registered successfully.";

      setMessage(successMessage);
      setIsError(false);

      setUsername("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error: unknown) {
      setIsError(true);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const serverMessage =
            typeof error.response.data === "string"
              ? error.response.data
              : error.response.data?.message || "Registration failed.";

          setMessage(serverMessage);
        } else {
          setMessage("Could not connect to the server.");
        }
      } else {
        setMessage("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="acc_modal">
      <h1>Create an account</h1>

      {message && (
        <p className={`status-message ${isError ? "error" : "success"}`}>
          {message}
        </p>
      )}

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Click here to login</Link>
      </p>
    </div>
  );
}

export default Register;