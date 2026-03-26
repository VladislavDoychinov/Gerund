import React, { useEffect, useState } from "react";
import MapView from "./MapView";
import SideBar from "./SideBar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "./Map.css";

export default function Map() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setPosition([51.505, -0.09])
    );
  }, []);

  return (
    <div className="mp-app-wrapper">
      <Header />
      <main className="mp-main">
        <SideBar position={position} />
        <MapView position={position} />
      </main>
      <Footer />
    </div>
  );
}