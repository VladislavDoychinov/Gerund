import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import "./StorePage.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProductGrid, { Product } from "./Components/ProductGrid";

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/products");
      setProducts(result.data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAppliedSearch(searchInput.trim().toLowerCase());
  };

  const filteredProducts = appliedSearch
    ? products.filter((product) => {
        const searchableText = [
          product.name,
          product.description,
          product.category,
          product.createdByEmail,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(appliedSearch);
      })
    : products;

  return (
    <div className="store-page">
      <Header />

      <form className="store-search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="store-search-input"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="store-search-btn" aria-label="Search">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
            focusable="false"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="16.65"
              y1="16.65"
              x2="21"
              y2="21"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </form>

      <h1 className="store-title">Marketplace</h1>

      <main className="store-products-slot">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </main>

      <Footer />
    </div>
  );
}
