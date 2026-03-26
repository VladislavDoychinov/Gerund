import { useEffect, useState } from "react";
import { api } from "../api";
import "./Register.css";
<<<<<<< HEAD
import { Link } from "react-router-dom";
=======
>>>>>>> 82e6d44df6d511ec60346e480c0f3f9f54c2b015

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
<<<<<<< HEAD
      if (error.response) {
        alert("Error: " + error.response.data);
      } else {
        alert("Error: " + error.message);
      }
=======
      alert(error);
>>>>>>> 82e6d44df6d511ec60346e480c0f3f9f54c2b015
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
<<<<<<< HEAD

      <p>
        Don't have an account? <Link to="/signup">Click here to sign up</Link>
      </p>
=======
>>>>>>> 82e6d44df6d511ec60346e480c0f3f9f54c2b015
    </div>
  );
}
