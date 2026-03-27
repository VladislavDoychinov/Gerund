import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
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
  "#3B82F6",
  "#EF4444",
  "#22C55E",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

type PinCategory = "STORE" | "EVENT" | "PROBLEM" | "OTHER";

const CATEGORY_OPTIONS: { value: PinCategory; label: string }[] = [
  { value: "STORE", label: "Store" },
  { value: "EVENT", label: "Event" },
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
  imageUrl?: string;
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

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (pos: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
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
      <span
        className={`mp-map-badge ${isOnline ? "mp-badge-online" : "mp-badge-offline"}`}
      >
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
}

function MapOverlayControls({
  position,
  pins,
}: {
  position: LatLngExpression | null;
  pins: Pin[];
}) {
  const map = useMap();
  const controlsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    L.DomEvent.disableClickPropagation(controlsRef.current);
    L.DomEvent.disableScrollPropagation(controlsRef.current);
  }, []);

  const swallowEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleGoToMostRecentMark = () => {
    if (pins.length > 0) {
      const mostRecentPin = pins.reduce((latest, current) =>
        current.id > latest.id ? current : latest,
      );
      map.flyTo([mostRecentPin.lat, mostRecentPin.lng], 15);
      return;
    }
    if (position) map.setView(position, 13);
  };

  const handleResetView = () => {
    if (pins.length > 0) {
      const bounds = L.latLngBounds(
        pins.map((pin) => [pin.lat, pin.lng] as [number, number]),
      );
      map.fitBounds(bounds, { padding: [35, 35] });
      return;
    }
    if (position) {
      map.setView(position, 13);
      return;
    }
    map.setView([20, 0], 2);
  };

  return (
    <div
      ref={controlsRef}
      className="mp-map-controls"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="mp-map-control-btn"
        onClick={(e) => { swallowEvent(e); handleGoToMostRecentMark(); }}
        title="Go to most recent mark"
        aria-label="Go to most recent mark"
      >
        ◎
      </button>
      <button
        type="button"
        className="mp-map-control-btn"
        onClick={(e) => { swallowEvent(e); map.zoomIn(); }}
        title="Zoom in"
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        type="button"
        className="mp-map-control-btn"
        onClick={(e) => { swallowEvent(e); map.zoomOut(); }}
        title="Zoom out"
        aria-label="Zoom out"
      >
        -
      </button>
      <button
        type="button"
        className="mp-map-control-btn"
        onClick={(e) => { swallowEvent(e); handleResetView(); }}
        title="Reset map view"
        aria-label="Reset map view"
      >
        ↺
      </button>
    </div>
  );
}

export default function MapView({
  position,
}: {
  position: LatLngExpression | null;
}) {
  const [allPins, setAllPins] = useState<Pin[]>([]);
  const [myPins, setMyPins] = useState<Pin[]>([]);
  const [draftPin, setDraftPin] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<PinFormData>({
    headline: "",
    description: "",
    color: PRESET_COLORS[0],
    category: "OTHER",
  });

  const currentUser = localStorage.getItem("username") || "Anonymous";

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
    setSelectedFile(null);
    setFormData({
      headline: "",
      description: "",
      color: PRESET_COLORS[0],
      category: "OTHER",
    });
  };

  const savePin = async () => {
    if (!draftPin) return;

    const data = new FormData();
    const pinData = new Blob([JSON.stringify({ 
      ...draftPin, 
      userId: currentUser, 
      ...formData 
    })], { type: 'application/json' });

    data.append("pin", pinData);
    
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      const response = await fetch("http://localhost:8080/api/pins", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const savedPin = await response.json();
        setAllPins((prev) => [...prev, savedPin]);
        setDraftPin(null);
        setSelectedFile(null);
      } else {
        console.error("Server responded with error:", response.status);
      }
    } catch (error) {
      console.error("Failed to save pin:", error);
    }
  };
  const removePin = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pins/${id}`, {
        method: "DELETE",
      });
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
        syncStorage(updatedAll, updatedMy);
      }
    } catch (error) {
      console.error("Failed to save favourite:", error);
    }
  };

  return (
    <div className="mp-map-wrapper">
      <MapHeader pinCount={allPins.length} />
      <MapContainer
        center={position || [0, 0]}
        zoom={position ? 13 : 2}
        zoomControl={false}
        className="mp-map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapOverlayControls position={position} pins={allPins} />

        {position && (
          <>
            <Marker position={position}>
              <Popup>Your Location</Popup>
            </Marker>
            <RecenterMap position={position} />
          </>
        )}

        <MapClickHandler onMapClick={handleMapClick} />

        {draftPin && (
          <Marker
            position={[draftPin.lat, draftPin.lng]}
            icon={createColoredIcon(formData.color)}
          >
            <Popup closeButton={false} closeOnClick={false}>
              <div className="mp-popup-form">
                <strong>Add Details</strong>
                <input
                  className="mp-input"
                  placeholder="Headline"
                  value={formData.headline}
                  onChange={(e) =>
                    setFormData({ ...formData, headline: e.target.value })
                  }
                />
                <textarea
                  className="mp-input"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />

                <div className="mp-color-picker-label">Image (optional)</div>
                <input 
                  type="file" 
                  accept="image/*"
                  className="mp-input mp-file-input"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />

                <div className="mp-color-picker-label">Category</div>
                <div className="mp-category-options">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.value}
                      className={`mp-category-btn ${formData.category === cat.value ? "mp-category-btn--active" : ""}`}
                      onClick={() =>
                        setFormData({ ...formData, category: cat.value })
                      }
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="mp-color-picker-label">Pin Color</div>
                <div className="mp-color-swatches">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      className={`mp-color-swatch ${formData.color === c ? "mp-color-swatch--active" : ""}`}
                      style={{ background: c }}
                      onClick={() => setFormData({ ...formData, color: c })}
                    />
                  ))}
                </div>

                <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                  <button className="mp-save-btn" onClick={savePin}>
                    Save
                  </button>
                  <button
                    className="mp-cancel-btn"
                    onClick={() => { setDraftPin(null); setSelectedFile(null); }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {allPins.map((pin) => {
          const isOwner = pin.userId === currentUser;
          const isFavourited = pin.favouritedBy?.includes(currentUser);
          return (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={createColoredIcon(pin.color || "#3B82F6")}
            >
              <Popup>
                <div className="mp-pin-popup">
                  {pin.imageUrl && (
                    <img 
                      src={`http://localhost:8080${pin.imageUrl}`} 
                      alt={pin.headline} 
                      className="mp-pin-image"
                      style={{ width: "100%", borderRadius: "4px", marginBottom: "8px" }}
                    />
                  )}
                  <h4 className="mp-pin-popup-title">{pin.headline || "Untitled Pin"}</h4>
                  {pin.description && (
                    <p className="mp-pin-popup-desc">{pin.description}</p>
                  )}
                  <div className="mp-pin-popup-actions">
                    <button
                      className={`mp-fav-btn ${isFavourited ? "mp-fav-btn--active" : ""}`}
                      onClick={() => saveFavourite(pin.id)}
                    >
                      {isFavourited ? "★ Unfavourite" : "☆ Save as Favourite"}
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => removePin(pin.id)}
                        className="mp-remove-link"
                      >
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