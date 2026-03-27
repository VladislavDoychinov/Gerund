import React, { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";

const SIDE_ITEMS = ["My Locations", "Saved Places", "Settings"];

type PinCategory = "STORE" | "PROBLEM" | "OTHER";

type Pin = {
  id: number;
  lat: number;
  lng: number;
  userId: string;
  headline: string;
  description: string;
  favouritedBy: string[];
  color: string;
  category: PinCategory;
};

export default function SideBar({
  position,
}: {
  position: LatLngExpression | null;
}) {
  const [active, setActive] = useState("My Locations");
  const [myPins, setMyPins] = useState<Pin[]>([]);
  const [allPins, setAllPins] = useState<Pin[]>([]);
  const currentUser = localStorage.getItem("username") || "Anonymous";

  const refresh = () => {
    // My Locations tab: pins owned by the current user
    const savedMy = localStorage.getItem("mp-saved-pins");
    setMyPins(savedMy ? JSON.parse(savedMy) : []);

    // Saved Places tab: any pin (including other users') favourited by current user
    const savedAll = localStorage.getItem("mp-all-pins");
    setAllPins(savedAll ? JSON.parse(savedAll) : []);
  };

  useEffect(() => {
    refresh();
    window.addEventListener("storage-update", refresh);
    return () => window.removeEventListener("storage-update", refresh);
  }, []);

  // Favourites come from ALL pins, not just the user's own pins
  const favouritePins = allPins.filter((p) =>
    p.favouritedBy?.includes(currentUser),
  );

  const saveFavourite = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/pins/${id}/favourite?userId=${currentUser}`,
        { method: "PATCH" },
      );
      if (response.ok) {
        const updatedPin: Pin = await response.json();
        const updatedAll = allPins.map((p) => (p.id === id ? updatedPin : p));
        const updatedMy = myPins.map((p) => (p.id === id ? updatedPin : p));
        setAllPins(updatedAll);
        setMyPins(updatedMy);
        localStorage.setItem("mp-all-pins", JSON.stringify(updatedAll));
        localStorage.setItem("mp-saved-pins", JSON.stringify(updatedMy));
        window.dispatchEvent(new Event("storage-update"));
      }
    } catch (error) {
      console.error("Failed to save favourite:", error);
    }
  };

  const PinCard = ({ pin }: { pin: Pin }) => {
    const isFavourited = pin.favouritedBy?.includes(currentUser);
    const isUntitled = !pin.headline || pin.headline.trim().length === 0;

    return (
      <li
        className={`mp-pin-card ${isFavourited ? "mp-pin-card--fav" : ""} ${isUntitled ? "mp-pin-card--untitled" : ""}`}
        style={{ borderLeftColor: pin.color || "#3B82F6" }}
      >
        <div className="mp-pin-card-header">
          <span
            className="mp-pin-color-dot"
            style={{ background: pin.color || "#3B82F6" }}
          />
          <span className="mp-pin-card-title">
            {pin.headline || "Untitled Pin"}
          </span>
          <button
            className={`mp-fav-star ${isFavourited ? "mp-fav-star--active" : ""}`}
            onClick={() => saveFavourite(pin.id)}
            title={
              isFavourited ? "Remove from favourites" : "Save as favourite"
            }
          >
            {isFavourited ? "★" : "☆"}
          </button>
        </div>
        {pin.description && (
          <div className="mp-pin-card-desc">{pin.description}</div>
        )}
        <div className="mp-pin-card-coords">
          {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
        </div>
      </li>
    );
  };

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
                {badge !== null ? `${item} (${badge})` : item}
              </button>
            </li>
          );
        })}
      </ul>

      {active === "My Locations" && (
        <ul className="mp-pin-list">
          {myPins.length === 0 ? (
            <li className="mp-pin-list-empty">No pins yet.</li>
          ) : (
            myPins.map((pin) => <PinCard key={pin.id} pin={pin} />)
          )}
        </ul>
      )}

      {active === "Saved Places" && (
        <ul className="mp-pin-list">
          {favouritePins.length === 0 ? (
            <li className="mp-pin-list-empty">No favourites yet.</li>
          ) : (
            favouritePins.map((pin) => <PinCard key={pin.id} pin={pin} />)
          )}
        </ul>
      )}
    </aside>
  );
}
