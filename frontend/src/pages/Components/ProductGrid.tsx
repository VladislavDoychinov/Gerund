import React from "react";
import { Link } from "react-router-dom";
import { products, Product } from "../data/products"
import strawberryImg from "../image/strawberry.jpg";
import bananaImg from "../image/banana.png";
import appleImg from "../image/apple.png";
import "../StorePage.css";
import "../Categories.css";

export default function ProductGrid() {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <Link to={`/product/${product.id}`} key={product.id}>
          <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <span className={`checkbox-label ${product.category}`}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
            <p>${product.price.toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}