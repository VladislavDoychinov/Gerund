import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StorePage.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProductGrid, { Product } from "./Components/ProductGrid";

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="store-page">
      <Header />
      <h1 className="store-title">Marketplace</h1>

      {loading ? <p>Loading products...</p> : <ProductGrid products={products} />}

      <Footer />
    </div>
  );
}