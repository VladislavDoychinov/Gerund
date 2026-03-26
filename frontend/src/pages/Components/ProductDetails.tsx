import React from "react";
import { Link } from "react-router-dom";
import "../ProductPage.css";
import "../Categories.css";

export default function ProductDetails({ product }: { product: any }) {
  return (
    <div className="product-card-container">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-details">
        <h1>{product.name}</h1>
        <span className={`checkbox-label ${product.category}`}>
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </span>
        <p className="quantity">Quantity: {product.quantity}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="description">{product.description}</p>
        <div className="product-buttons">
          <button>Add to Cart</button>
          <Link to="/store">Back to Store</Link>
        </div>
      </div>
    </div>
  );
}