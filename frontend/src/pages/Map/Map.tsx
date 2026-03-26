import React from "react";
import "./Map.css";
import Header from "./Header";
import SideBar from "./SideBar";
import MapView from "./MapView";
import Footer from "./Footer";

export default function Map() {
  return (
    <div className="mp-root">
      <Header />
      <main className="mp-main">
        <SideBar />
        <MapView />
      </main>
      <Footer />
    </div>
  );
}
