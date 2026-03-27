import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import "./StorePage.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProductGrid, { Product } from "./Components/ProductGrid";

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "Vintage Camera", price: 150.00, imageUrl: "https://via.placeholder.com/300", description: "A beautiful 35mm film camera.", quantity: 1, category: "electronics", createdByEmail: "alice@example.com" },
  { id: 2, name: "Green Couch", price: 450.00, imageUrl: "https://via.placeholder.com/300", description: "Very comfortable velvet sofa.", quantity: 1, category: "furniture", createdByEmail: "bob@example.com" },
  { id: 3, name: "Mountain Bike", price: 800.00, imageUrl: "https://via.placeholder.com/300", description: "Ready for the trails.", quantity: 1, category: "sports", createdByEmail: "charlie@example.com" },
];

export default function MockStorePage() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAppliedSearch(searchInput.trim().toLowerCase());
  };

  const filteredProducts = appliedSearch
    ? products.filter((p) => p.name.toLowerCase().includes(appliedSearch))
    : products;

  return (
    <div className="store-page">
      <Header />
      <form className="store-search-form" onSubmit={handleSearchSubmit}>
        <input 
            type="text" 
            className="store-search-input" 
            placeholder="Search (Mock Mode)..." 
            value={searchInput} 
            onChange={(e) => setSearchInput(e.target.value)} 
        />
        <button type="submit" className="store-search-btn">Search</button>
      </form>
      <h1 className="store-title">Marketplace (Mock)</h1>
      <main className="store-products-slot">
        <ProductGrid products={filteredProducts} />
      </main>
      <Footer />
    </div>
  );
}