import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./StorePage.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProductGrid, { Product } from "./Components/ProductGrid";

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ["all", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(lower) ||
          product.description.toLowerCase().includes(lower) ||
          product.createdByEmail.toLowerCase().includes(lower)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, search, selectedCategory, sortBy]);

  return (
    <div className="store-page">
      <Header />

      <section className="store-hero">
        <div className="store-hero__content">
          <p className="store-hero__eyebrow">Fresh marketplace</p>
          <h1 className="store-title">Marketplace</h1>
          <p className="store-hero__text">
            Browse offers, compare listings, and connect directly with sellers.
          </p>
        </div>
      </section>

      <section className="store-content">
        <div className="store-toolbar">
          <div className="store-toolbar__left">
            <input
              type="text"
              placeholder="Search products, sellers, descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="store-search"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="store-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all"
                    ? "All Categories"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="store-select"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </select>
          </div>

          <div className="store-toolbar__right">
            <h2>{filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}</h2>
          </div>
        </div>

        {loading ? (
          <div className="store-loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="store-empty">
            <h3>No products found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </section>

      <Footer />
    </div>
  );
}