import { useEffect, useState } from "react";
import { api } from "../api";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  useEffect(() => {
    document.title = "Log in Your profile";
  }, []);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      setMessage(response.data.message);
      console.log("Logged in user:", response.data);

      setEmail("");
      setPassword("");

      navigate("/main");
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

      <p>
        <Link to="/store" className="text-blue-500 underline">
          Fruits & Vegetables Store
        </Link>
      </p>
    </div>
  );
}