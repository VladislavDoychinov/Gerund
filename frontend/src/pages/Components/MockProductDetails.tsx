import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../ProductPage.css";

export default function MockProductDetails({ product }: { product: any }) {
  const [message, setMessage] = useState("");
  // Toggle this manually to test "Delete" vs "Accept Offer" buttons
  const isOwner = false; 

  const handleAction = () => {
    setMessage(isOwner ? "Mock: Product deleted!" : "Mock: Offer accepted!");
  };

  return (
    <div className="product-card-container">
      <div className="product-image">
        <img src="https://via.placeholder.com/500" alt={product.name} />
      </div>
      <div className="product-details">
        <h1>{product.name} (Mock)</h1>
        <span className={`checkbox-label ${product.category}`}>{product.category}</span>
        <p className="quantity">Quantity: {product.quantity}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="description">{product.description}</p>
        
        {message && <p className="status-message" style={{color: 'green'}}>{message}</p>}

        <div className="product-buttons">
          <button onClick={handleAction}>
            {isOwner ? "Delete Product" : "Accept Offer"}
          </button>
          <Link to="/store">Back to Store</Link>
        </div>
      </div>
    </div>
  );
}