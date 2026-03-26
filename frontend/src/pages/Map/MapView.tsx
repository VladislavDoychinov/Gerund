import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

const POSITION: LatLngExpression = [42.6977, 23.3219];

export default function MapView() {
  return (
    <div className="mp-map-wrapper">
      <MapHeader />
      <MapContainer
        center={POSITION}
        zoom={13}
        scrollWheelZoom={true}
        className="mp-map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={POSITION}>
          <Popup>You are here</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

function MapHeader() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="mp-map-header">
      <h2 className="mp-map-title">Interactive Map</h2>
      <span
        className={`mp-map-badge ${isOnline ? "mp-badge-online" : "mp-badge-offline"}`}
      >
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
}
