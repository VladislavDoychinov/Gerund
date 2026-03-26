import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { products, Product } from "./data/products"
import "./ProductPage.css";
import "./Categories.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProductDetails from "./Components/ProductDetails";
import RelatedProducts from "./Components/RelatedProducts";
import strawberryImg from "./image/strawberry.jpg";
import bananaImg from "./image/banana.png";
import appleImg from "./image/apple.png";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="product-page">
        <h2>Product Not Found</h2>
        <Link to="/store" className="back-link">Back to Store</Link>
      </div>
    );
  }

  const relatedProducts = products.filter((p) => p.id !== product.id);

  return (
    <div className="product-page">
      <Header />
      <ProductDetails product={product} />
      <RelatedProducts products={relatedProducts} />
      <Footer />
    </div>
  );
}