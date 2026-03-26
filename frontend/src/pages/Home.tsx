import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Header from "./Components/Header";
import "./Home.css";

type CurrentUser = {
  userId: number;
  email: string;
};

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const navigate = useNavigate();
  const position: LatLngExpression = [42.6977, 23.3219];

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

      <main className="home-main-layout">
        <section className="home-sidebar-card">
          <h2 className="home-section-title">Navigation</h2>

          <ul className="home-nav-list">
            <li>
              <button className="home-side-btn">My Location</button>
            </li>
            <li>
              <button className="home-side-btn">Saved Places</button>
            </li>
            <li>
              <button className="home-side-btn">Settings</button>
            </li>
          </ul>
        </section>

        <section className="home-map-card">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            className="home-map"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={position}>
              <Popup>You are here</Popup>
            </Marker>
          </MapContainer>
        </section>
      </main>

      <footer className="home-footer">© 2026 Map App</footer>
    </div>
  );
}
