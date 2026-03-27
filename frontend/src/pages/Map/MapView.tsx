import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { LatLngExpression, LatLng } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const PRESET_COLORS = [
  "#3B82F6", "#EF4444", "#22C55E", "#F59E0B",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316",
];

type PinCategory = "STORE" | "PROBLEM" | "OTHER";

const CATEGORY_OPTIONS: { value: PinCategory; label: string;}[] = [
  { value: "STORE", label: "Store" },
  { value: "PROBLEM", label: "Problem" },
  { value: "OTHER", label: "Other" },
];

function createColoredIcon(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"
        fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="4" fill="white" opacity="0.85"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
}

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

type PinFormData = {
  headline: string;
  description: string;
  color: string;
  category: PinCategory;
};

function RecenterMap({ position }: { position: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 13);
  }, [position, map]);
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: (pos: LatLng) => void }) {
  useMapEvents({
    click(e) { onMapClick(e.latlng); },
  });
  return null;
}

function MapHeader({ pinCount }: { pinCount: number }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handle = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handle);
    window.addEventListener("offline", handle);
    return () => {
      window.removeEventListener("online", handle);
      window.removeEventListener("offline", handle);
    };
  }, []);

  return (
    <div className="mp-map-header">
      <h2 className="mp-map-title">Interactive Map ({pinCount})</h2>
      <span className={`mp-map-badge ${isOnline ? "mp-badge-online" : "mp-badge-offline"}`}>
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
}

export default function MapView({ position }: { position: LatLngExpression | null }) {
  const [allPins, setAllPins] = useState<Pin[]>([]);
  const [myPins, setMyPins] = useState<Pin[]>([]);
  const [draftPin, setDraftPin] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState<PinFormData>({
    headline: "",
    description: "",
    color: PRESET_COLORS[0],
    category: "OTHER",
  });

  const currentUser = localStorage.getItem("username") || "Anonymous";

  // Helper: sync both localStorage keys and fire storage-update
  const syncStorage = (updatedAllPins: Pin[], updatedMyPins: Pin[]) => {
    localStorage.setItem("mp-all-pins", JSON.stringify(updatedAllPins));
    localStorage.setItem("mp-saved-pins", JSON.stringify(updatedMyPins));
    window.dispatchEvent(new Event("storage-update"));
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/pins")
      .then((res) => res.json())
      .then((data: Pin[]) => {
        setAllPins(data);
        localStorage.setItem("mp-all-pins", JSON.stringify(data));
        window.dispatchEvent(new Event("storage-update"));
      })
      .catch((err) => console.error("Error loading all pins:", err));

    fetch(`http://localhost:8080/api/pins/user/${currentUser}`)
      .then((res) => res.json())
      .then((data: Pin[]) => {
        setMyPins(data);
        localStorage.setItem("mp-saved-pins", JSON.stringify(data));
        window.dispatchEvent(new Event("storage-update"));
      })
      .catch((err) => console.error("Error loading my pins:", err));
  }, [currentUser]);

  const handleMapClick = (latlng: LatLng) => {
    setDraftPin({ lat: latlng.lat, lng: latlng.lng });
    setFormData({ headline: "", description: "", color: PRESET_COLORS[0], category: "OTHER" });
  };

  const savePin = async () => {
    if (!draftPin) return;
    try {
      const response = await fetch("http://localhost:8080/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draftPin, userId: currentUser, ...formData }),
      });
      if (response.ok) {
        const savedPin: Pin = await response.json();
        const updatedAll = [...allPins, savedPin];
        const updatedMy = [...myPins, savedPin];
        setAllPins(updatedAll);
        setMyPins(updatedMy);
        syncStorage(updatedAll, updatedMy);
        setDraftPin(null);
      }
    } catch (error) {
      console.error("Failed to save pin:", error);
    }
  };

  const removePin = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pins/${id}`, { method: "DELETE" });
      if (response.ok) {
        const updatedAll = allPins.filter((p) => p.id !== id);
        const updatedMy = myPins.filter((p) => p.id !== id);
        setAllPins(updatedAll);
        setMyPins(updatedMy);
        syncStorage(updatedAll, updatedMy);
      }
    } catch (error) {
      console.error("Failed to delete pin:", error);
    }
  };

  const saveFavourite = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pins/${id}/favourite?userId=${currentUser}`, { method: "PATCH" });
      if (response.ok) {
        const updatedPin: Pin = await response.json();
        // Update allPins — this covers pins owned by anyone
        const updatedAll = allPins.map((p) => (p.id === id ? updatedPin : p));
        // Update myPins only for pins the current user owns
        const updatedMy = myPins.map((p) => (p.id === id ? updatedPin : p));
        setAllPins(updatedAll);
        setMyPins(updatedMy);
        syncStorage(updatedAll, updatedMy);
      }
    } catch (error) {
      console.error("Failed to save favourite:", error);
    }
  };

  return (
    <div className="mp-map-wrapper">
      <MapHeader pinCount={allPins.length} />
      <MapContainer center={position || [0, 0]} zoom={position ? 13 : 2} className="mp-map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {position && <RecenterMap position={position} />}
        <MapClickHandler onMapClick={handleMapClick} />

        {allPins.map((pin) => {
          const isOwner = pin.userId === currentUser;
          const isFavourited = pin.favouritedBy?.includes(currentUser);
          return (
            <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={createColoredIcon(pin.color || "#3B82F6")}>
              <Popup>
                <div className="mp-pin-popup">
                  <h4 className="mp-pin-popup-title">{pin.headline || "Untitled Pin"}</h4>
                  {pin.description && <p className="mp-pin-popup-desc">{pin.description}</p>}
                  <div className="mp-pin-popup-actions">
                    <button
                      className={`mp-fav-btn ${isFavourited ? "mp-fav-btn--active" : ""}`}
                      onClick={() => saveFavourite(pin.id)}
                    >
                      {isFavourited ? "★ Unfavourite" : "☆ Save as Favourite"}
                    </button>
                    {isOwner && (
                      <button onClick={() => removePin(pin.id)} className="mp-remove-link">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}