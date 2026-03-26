import React, { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";

const SIDE_ITEMS = ["My Locations", "Saved Places", "Settings"];

type Pin = {
  id: number;
  lat: number;
  lng: number;
  userId: string;
  headline: string;
  description: string;
  favourite: boolean;
};

export default function SideBar({ position }: { position: LatLngExpression | null }) {
  const [active, setActive] = useState("My Locations");
  const [myPins, setMyPins] = useState<Pin[]>([]);

  const refresh = () => {
    const saved = localStorage.getItem("mp-saved-pins");
    setMyPins(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    refresh();
    window.addEventListener("storage-update", refresh);
    return () => window.removeEventListener("storage-update", refresh);
  }, []);

  const favouritePins = myPins.filter((p) => p.favourite);

  const toggleFavourite = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pins/${id}/favourite`, {
        method: "PATCH",
      });
      if (response.ok) {
        const updatedPin: Pin = await response.json();
        const updated = myPins.map((p) => (p.id === id ? updatedPin : p));
        setMyPins(updated);
        localStorage.setItem("mp-saved-pins", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage-update"));
      }
    } catch (error) {
      console.error("Failed to toggle favourite:", error);
    }
  };

  const lat = position && Array.isArray(position) ? (position as number[])[0] : null;
  const lng = position && Array.isArray(position) ? (position as number[])[1] : null;

  return (
    <aside className="mp-sidebar">
      <h2 className="mp-sidebar-title">Navigation</h2>

      <ul className="mp-sidebar-list">
        {SIDE_ITEMS.map((item) => {
          const badge =
            item === "My Locations"
              ? myPins.length
              : item === "Saved Places"
              ? favouritePins.length
              : null;
          return (
            <li key={item}>
              <button
                className={`mp-side-btn ${active === item ? "mp-side-btn--active" : ""}`}
                onClick={() => setActive(item)}
              >
                <div className="mp-side-dot" />
                {badge !== null ? `${item} (${badge})` : item}
              </button>
            </li>
          );
        })}
      </ul>

      {active === "My Locations" && (
        <ul className="mp-pin-list">
          {myPins.length === 0 ? (
            <li className="mp-pin-list-empty">
            </li>
          ) : (
            myPins.map((pin) => (
              <li key={pin.id} className="mp-pin-card">
                <div className="mp-pin-card-header">
                  <span className="mp-pin-card-title">
                    📍 {pin.headline || "Untitled Pin"}
                  </span>
                  <button
                    className={`mp-fav-star ${pin.favourite ? "mp-fav-star--active" : ""}`}
                    onClick={() => toggleFavourite(pin.id)}
                    title={pin.favourite ? "Remove from favourites" : "Add to favourites"}
                  >
                    {pin.favourite ? "★" : "☆"}
                  </button>
                </div>
                {pin.description && (
                  <div className="mp-pin-card-desc">{pin.description}</div>
                )}
                <div className="mp-pin-card-coords">
                  {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      {active === "Saved Places" && (
        <ul className="mp-pin-list">
          {favouritePins.length === 0 ? (
            <li className="mp-pin-list-empty">
              No favourites yet — tap ☆ on any of your pins to save it here.
            </li>
          ) : (
            favouritePins.map((pin) => (
              <li key={pin.id} className="mp-pin-card mp-pin-card--fav">
                <div className="mp-pin-card-header">
                  <span className="mp-pin-card-title">
                    ★ {pin.headline || "Untitled Pin"}
                  </span>
                  <button
                    className="mp-fav-star mp-fav-star--active"
                    onClick={() => toggleFavourite(pin.id)}
                    title="Remove from favourites"
                  >
                    ★
                  </button>
                </div>
                {pin.description && (
                  <div className="mp-pin-card-desc">{pin.description}</div>
                )}
                <div className="mp-pin-card-coords">
                  {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
      {active === "Settings" && (
        <div className="mp-settings-placeholder">
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Settings coming soon.
          </p>
        </div>
      )}

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