import { useEffect, useState } from "react";
import { api } from "../api";
import "./Register.css";

export default function Login() {
    useEffect(() => {
          document.title = "Log in Your profile";
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      alert(response.data);
    } catch (error: any) {
      alert(error);
    }
  };

  return (
    <div className="acc_modal">
      <form onSubmit={handleSubmit}>
        <h1>Log in Your profile</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
