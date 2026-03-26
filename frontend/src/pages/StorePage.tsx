import React from "react";
import "./StorePage.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProductGrid from "./Components/ProductGrid";

export default function StorePage() {
  return (
    <div className="store-page">
      <Header />
      <h1 className="store-title">Marketplace</h1>
      <ProductGrid />
      <Footer />
    </div>
  );
}