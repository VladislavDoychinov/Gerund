import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import "./Home.css";

type CurrentUser = {
  userId: number;
  email: string;
};

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/auth/me", {
        withCredentials: true,
      });

      setCurrentUser(result.data);
    } catch (error) {
      console.error("Failed to load current user:", error);
      setCurrentUser(null);
    }
  };

  return (
    <div className="home-page">
      <Header />

      <main className="home-content">
        <section className="home-hero">
          <p className="home-kicker">...</p>
          <h1 className="home-title">
            Welcome{currentUser ? `, ${currentUser.email}` : " to PulsePoint"}
          </h1>
          <p className="home-subtitle">...</p>

          <div className="home-hero-actions">
            <button
              className="home-primary-btn"
              type="button"
              onClick={() => navigate("/store")}
            >
              Explore Marketplace
            </button>
            <button
              className="home-secondary-btn"
              type="button"
              onClick={() => navigate("/map")}
            >
              Open Map
            </button>
          </div>
        </section>

        <section className="home-links" aria-label="Website navigation">
          <article className="home-link-card">
            <h2>Map</h2>
            <p>...</p>
            <button type="button" onClick={() => navigate("/map")}>
              Go to Map
            </button>
          </article>

          <article className="home-link-card">
            <h2>Marketplace</h2>
            <p>...</p>
            <button type="button" onClick={() => navigate("/store")}>
              Go to Store
            </button>
          </article>

          <article className="home-link-card">
            <h2>Profile</h2>
            <p>...</p>
            <button type="button" onClick={() => navigate("/profile")}>
              Go to Profile
            </button>
          </article>

          <article className="home-link-card">
            <h2>Add Product</h2>
            <p>Create a new listing so others can discover what you offer.</p>
            <button type="button" onClick={() => navigate("/addproduct")}>
              Create Listing
            </button>
          </article>
        </section>

        <section className="home-about">
          <h2>About this website</h2>
          <p>...</p>
          <ol>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  );
}
