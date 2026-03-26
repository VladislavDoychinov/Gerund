import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import axios from "axios";

type CurrentUser = {
  userId: number;
  email: string;
};

export default function MainPage() {
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
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-semibold">
          Welcome, {currentUser?.email || "Guest"}
        </h1>

        <nav className="flex gap-4">
          <button className="border px-3 py-1 rounded">Home</button>
          <button className="border px-3 py-1 rounded">Map</button>
          <button
            onClick={() => navigate("/profile")}
            className="border px-3 py-1 rounded"
          >
            Profile
          </button>
        </nav>
      </header>

      <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow md:col-span-1">
          <h2 className="text-lg font-medium mb-2">Navigation</h2>

          <ul className="space-y-2">
            <li>
              <button className="w-full border p-2 rounded">
                My Location
              </button>
            </li>
            <li>
              <button className="w-full border p-2 rounded">
                Saved Places
              </button>
            </li>
            <li>
              <button className="w-full border p-2 rounded">
                Settings
              </button>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3 rounded-2xl overflow-hidden shadow">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            className="h-[500px] w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={position}>
              <Popup>You are here</Popup>
            </Marker>
          </MapContainer>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-gray-500">
        © 2026 Map App
      </footer>
    </div>
  );
}