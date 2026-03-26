import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { LatLngExpression, LatLng } from "leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

type Pin = { 
  id: number; 
  lat: number; 
  lng: number; 
  userId: string;
  headline: string;
  description: string;
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

export default function MapView({ position }: { position: LatLngExpression | null }) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [draftPin, setDraftPin] = useState<{lat: number, lng: number} | null>(null);
  const [formData, setFormData] = useState({ headline: "", description: "" });

  useEffect(() => {
    const currentUser = localStorage.getItem("username") || "Anonymous";
    fetch(`http://localhost:8080/api/pins/user/${currentUser}`)
      .then((res) => res.json())
      .then((data) => setPins(data))
      .catch((err) => console.error("Error loading pins:", err));
  }, []);

  const handleMapClick = (latlng: LatLng) => {
    setDraftPin({ lat: latlng.lat, lng: latlng.lng });
    setFormData({ headline: "", description: "" });
  };

  const savePin = async () => {
    if (!draftPin) return;
    const currentUser = localStorage.getItem("username") || "Anonymous";

    try {
      const response = await fetch("http://localhost:8080/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: draftPin.lat,
          lng: draftPin.lng,
          userId: currentUser,
          headline: formData.headline,
          description: formData.description
        }),
      });

      if (response.ok) {
        const savedPin = await response.json();
        setPins((prev) => [...prev, savedPin]);
        setDraftPin(null);
        window.dispatchEvent(new Event("storage-update"));
      }
    } catch (error) {
      console.error("Failed to save pin:", error);
    }
  };

  const removePin = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pins/${id}`, { method: "DELETE" });
      if (response.ok) {
        setPins((prev) => prev.filter(p => p.id !== id));
        window.dispatchEvent(new Event("storage-update"));
      }
    } catch (error) {
      console.error("Failed to delete pin:", error);
    }
  };

  return (
    <div className="mp-map-wrapper">
      <MapHeader pinCount={pins.length} />
      <MapContainer center={position || [0, 0]} zoom={position ? 13 : 2} className="mp-map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {position && (
          <>
            <Marker position={position}><Popup>Your Location</Popup></Marker>
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
                  onChange={(e) => setFormData({...formData, headline: e.target.value})}
                />
                <textarea 
                  className="mp-input" 
                  placeholder="Description" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button className="mp-save-btn" onClick={savePin}>Save</button>
                  <button className="mp-cancel-btn" onClick={() => setDraftPin(null)}>Cancel</button>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ color: 'var(--sky-700)', margin: 0 }}>{pin.headline}</h4>
                <p style={{ fontSize: '0.85rem' }}>{pin.description}</p>
                <button onClick={() => removePin(pin.id)} className="mp-remove-link">Remove</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
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