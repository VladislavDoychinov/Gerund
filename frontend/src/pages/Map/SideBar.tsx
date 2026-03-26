import React, { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";

const SIDE_ITEMS = ["My Location", "Saved Places", "Settings"];

export default function SideBar({ position }: { position: LatLngExpression | null }) {
  const [active, setActive] = useState("My Location");
  const [count, setCount] = useState(0);

  const updateCount = () => {
    const saved = localStorage.getItem("mp-saved-pins");
    setCount(saved ? JSON.parse(saved).length : 0);
  };

  useEffect(() => {
    updateCount();
    window.addEventListener("storage-update", updateCount);
    return () => window.removeEventListener("storage-update", updateCount);
  }, []);

  const lat = position && Array.isArray(position) ? position[0] : null;
  const lng = position && Array.isArray(position) ? position[1] : null;

  return (
    <aside className="mp-sidebar">
      <h2 className="mp-sidebar-title">Navigation</h2>
      <ul className="mp-sidebar-list">
        {SIDE_ITEMS.map((item) => (
          <li key={item}>
            <button
              className={`mp-side-btn ${active === item ? "mp-side-btn--active" : ""}`}
              onClick={() => setActive(item)}
            >
              <div className="mp-side-dot"></div>
              {item === "Saved Places" ? `${item} (${count})` : item}
            </button>
          </li>
        ))}
      </ul>

      <div className="mp-info-card">
        <div className="mp-info-label">Current Location</div>
        <div className="mp-info-value">{position ? "Detected" : "Locating..."}</div>
        <div className="mp-info-coords">
          {lat && lng ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : "--"}
        </div>
      </div>
    </aside>
  );
}