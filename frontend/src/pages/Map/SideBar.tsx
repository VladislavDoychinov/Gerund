import React, { useState } from "react";

const SIDE_ITEMS = ["My Location", "Saved Places", "Settings"];

export default function SideBar() {
  const [active, setActive] = useState("My Location");

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
              {item}
            </button>
          </li>
        ))}
      </ul>

      <div className="mp-info-card">
        <div className="mp-info-label">Current Location</div>
        <div className="mp-info-value">Sofia, Bulgaria</div>
        <div className="mp-info-coords">42.6977, 23.3219</div>
      </div>
    </aside>
  );
}
