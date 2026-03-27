import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProductGrid, { Product } from "./Components/ProductGrid";
import "./StorePage.css";

export default function SellerProfilePage() {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellerProducts();
  }, [email]);

  const loadSellerProducts = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/products/seller/${encodeURIComponent(email || "")}`
      );
      setProducts(result.data);
    } catch (error) {
      console.error("Failed to load seller products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="store-page">
      <Header />

      <section className="store-hero">
        <div className="store-hero__content">
          <p className="store-hero__eyebrow">Seller profile</p>
          <h1 className="store-title">{email}</h1>
          <p className="store-hero__text">
            Browse all listings from this seller.
          </p>
        </div>
      </section>

      <section className="store-content">
        <div className="store-toolbar">
          <div className="store-toolbar__right">
            <h2>{products.length} listing{products.length !== 1 ? "s" : ""}</h2>
          </div>

          <button className="store-select" onClick={() => navigate("/store")}>
            Back to Marketplace
          </button>
        </div>

        {loading ? (
          <div className="store-loading">Loading seller products...</div>
        ) : products.length === 0 ? (
          <div className="store-empty">
            <h3>No listings found</h3>
            <p>This seller has no products yet.</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>

      <Footer />
    </div>
  );
}