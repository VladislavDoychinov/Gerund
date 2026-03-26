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

type Pin = { id: number; lat: number; lng: number };

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
  const [pins, setPins] = useState<Pin[]>(() => {
    const saved = localStorage.getItem("mp-saved-pins");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("mp-saved-pins", JSON.stringify(pins));

    window.dispatchEvent(new Event("storage-update"));
  }, [pins]);

  const addPin = (latlng: LatLng) => {
    setPins((prev) => [...prev, { id: Date.now(), lat: latlng.lat, lng: latlng.lng }]);
  };

  const removePin = (id: number) => {
    setPins((prev) => prev.filter(p => p.id !== id));
  };

  return (
    <div className="mp-map-wrapper">
      <MapHeader pinCount={pins.length} />
      
      <MapContainer
        center={position || [0, 0]} 
        zoom={position ? 13 : 2}
        scrollWheelZoom={true}
        className="mp-map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {position && (
          <>
            <Marker position={position}><Popup>Your Location</Popup></Marker>
            <RecenterMap position={position} />
          </>
        )}

        <MapClickHandler onMapClick={addPin} />

        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong style={{ color: 'var(--sky-700)' }}>Pinned Location</strong><br />
                {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}<br />
                
                <button 
                  onClick={(e) => {
                
                    e.stopPropagation(); 
                    removePin(pin.id);
                  }}
                  style={{ 
                    color: '#ef4444', 
                    border: 'none', 
                    background: 'none', 
                    cursor: 'pointer', 
                    marginTop: '5px', 
                    fontWeight: 'bold' 
                  }}
                >
                  Remove Pin
                </button>
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