import React, { useState, useEffect } from "react";
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

type Pin = {
  id: number;
  lat: number;
  lng: number;
  userId: string;
  headline: string;
  description: string;
  favourite: boolean;
};

function RecenterMap({ position }: { position: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 13);
  }, [position, map]);
  return null;
}

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
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

export default function MapView({
  position,
}: {
  position: LatLngExpression | null;
}) {
  const [allPins, setAllPins] = useState<Pin[]>([]);
  const [myPins, setMyPins] = useState<Pin[]>([]);
  const [draftPin, setDraftPin] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [formData, setFormData] = useState({ headline: "", description: "" });

  const currentUser = localStorage.getItem("username") || "Anonymous";

  useEffect(() => {
    fetch("http://localhost:8080/api/pins")
      .then((res) => res.json())
      .then((data: Pin[]) => {
        setAllPins(data);
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
  }, []);

  const handleMapClick = (latlng: LatLng) => {
    setDraftPin({ lat: latlng.lat, lng: latlng.lng });
    setFormData({ headline: "", description: "" });
  };

  const savePin = async () => {
    if (!draftPin) return;
    try {
      const response = await fetch("http://localhost:8080/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: draftPin.lat,
          lng: draftPin.lng,
          userId: currentUser,
          headline: formData.headline,
          description: formData.description,
        }),
      });
      if (response.ok) {
        const savedPin: Pin = await response.json();

        setAllPins((prev) => [...prev, savedPin]);
        setMyPins((prev) => {
          const updated = [...prev, savedPin];
          localStorage.setItem("mp-saved-pins", JSON.stringify(updated));
          return updated;
        });

        setDraftPin(null);
        window.dispatchEvent(new Event("storage-update"));
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
        setAllPins((prev) => prev.filter((p) => p.id !== id));
        setMyPins((prev) => {
          const updated = prev.filter((p) => p.id !== id);
          localStorage.setItem("mp-saved-pins", JSON.stringify(updated));
          return updated;
        });
        window.dispatchEvent(new Event("storage-update"));
      }
    } catch (error) {
      console.error("Failed to delete pin:", error);
    }
  };

  const toggleFavourite = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/pins/${id}/favourite`,
        {
          method: "PATCH",
        },
      );
      if (response.ok) {
        const updatedPin: Pin = await response.json();

        setAllPins((prev) => prev.map((p) => (p.id === id ? updatedPin : p)));
        setMyPins((prev) => {
          const updated = prev.map((p) => (p.id === id ? updatedPin : p));
          localStorage.setItem("mp-saved-pins", JSON.stringify(updated));
          return updated;
        });

        window.dispatchEvent(new Event("storage-update"));
      }
    } catch (error) {
      console.error("Failed to toggle favourite:", error);
    }
  };

  return (
    <div className="mp-map-wrapper">
      <MapHeader pinCount={allPins.length} />
      <MapContainer
        center={position || [0, 0]}
        zoom={position ? 13 : 2}
        className="mp-map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <InvalidateSize />

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
          <Marker position={[draftPin.lat, draftPin.lng]}>
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
                <div style={{ display: "flex", gap: "5px" }}>
                  <button className="mp-save-btn" onClick={savePin}>
                    Save
                  </button>
                  <button
                    className="mp-cancel-btn"
                    onClick={() => setDraftPin(null)}
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
          return (
            <Marker key={pin.id} position={[pin.lat, pin.lng]}>
              <Popup>
                <div className="mp-pin-popup">
                  <h4 className="mp-pin-popup-title">
                    {pin.headline || "Untitled Pin"}
                  </h4>
                  {!isOwner && (
                    <p className="mp-pin-popup-owner">
                      📌 Added by {pin.userId}
                    </p>
                  )}
                  {pin.description && (
                    <p className="mp-pin-popup-desc">{pin.description}</p>
                  )}
                  <div className="mp-pin-popup-actions">
                    {isOwner && (
                      <>
                        <button
                          className={`mp-fav-btn ${pin.favourite ? "mp-fav-btn--active" : ""}`}
                          onClick={() => toggleFavourite(pin.id)}
                          title={
                            pin.favourite
                              ? "Remove from favourites"
                              : "Add to favourites"
                          }
                        >
                          {pin.favourite ? "★ Favourited" : "☆ Favourite"}
                        </button>
                        <button
                          onClick={() => removePin(pin.id)}
                          className="mp-remove-link"
                        >
                          Remove
                        </button>
                      </>
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
