import React, { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";

const SIDE_ITEMS = ["My Locations", "Saved Places", "Settings"];

type PinCategory = "STORE" | "EVENT" | "PROBLEM" | "OTHER";

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
  distance?: number;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function SideBar({
  position,
}: {
  position: LatLngExpression | null;
}) {
  const [active, setActive] = useState("My Locations");
  const [myPins, setMyPins] = useState<Pin[]>([]);
  const [allPins, setAllPins] = useState<Pin[]>([]);
  const [radius, setRadius] = useState(10);
  const [searchCategory, setSearchCategory] = useState<string>("ALL");
  
  const currentUser = localStorage.getItem("username") || "Anonymous";

  const refresh = () => {
    const savedMy = localStorage.getItem("mp-saved-pins");
    setMyPins(savedMy ? JSON.parse(savedMy) : []);

    const savedAll = localStorage.getItem("mp-all-pins");
    setAllPins(savedAll ? JSON.parse(savedAll) : []);
  };

  useEffect(() => {
    refresh();
    window.addEventListener("storage-update", refresh);
    return () => window.removeEventListener("storage-update", refresh);
  }, []);

  const favouritePins = allPins.filter((p) =>
    p.favouritedBy?.includes(currentUser),
  );

  const getNearestPins = () => {
    if (!position) return [];

    const uLat = Array.isArray(position) ? position[0] : (position as any).lat;
    const uLng = Array.isArray(position) ? position[1] : (position as any).lng;

    return allPins
      .map(pin => ({
        ...pin,
        distance: calculateDistance(uLat, uLng, pin.lat, pin.lng)
      }))
      .filter(pin => {
        const withinRadius = pin.distance <= radius;
        const matchesCategory = searchCategory === "ALL" || pin.category === searchCategory;
        return withinRadius && matchesCategory;
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  };

  const nearestPins = getNearestPins();

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
        {pin.distance !== undefined && (
          <div style={{ fontSize: '0.7rem', color: 'var(--sky-600)', fontWeight: 700, marginTop: '4px' }}>
            {pin.distance.toFixed(2)} km away
          </div>
        )}
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

      {active === "Settings" && (
        <div className="mp-settings-placeholder" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="mp-info-card">
            <div className="mp-info-label">Search Radius ({radius} km)</div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={radius} 
              onChange={(e) => setRadius(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div className="mp-info-label">Filter Category</div>
          <div className="mp-category-options">
            {["ALL", "STORE", "EVENT", "PROBLEM", "OTHER"].map((cat) => (
              <button
                key={cat}
                className={`mp-category-btn ${searchCategory === cat ? "mp-category-btn--active" : ""}`}
                onClick={() => setSearchCategory(cat)}
              >
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <h3 className="mp-sidebar-title" style={{ marginTop: '0.5rem', border: 'none' }}>
            Nearest results ({nearestPins.length})
          </h3>
          <ul className="mp-pin-list">
            {nearestPins.length === 0 ? (
              <li className="mp-pin-list-empty">No locations found nearby.</li>
            ) : (
              nearestPins.map((pin) => <PinCard key={pin.id} pin={pin} />)
            )}
          </ul>
        </div>
      )}
    </aside>
  );
}