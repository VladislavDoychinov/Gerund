import React from "react";
import { Link } from "react-router-dom";
import "../StorePage.css";
import "../Categories.css";

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  quantityValue: number;
  quantityUnit: string;
  category: string;
  createdByEmail: string;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <Link to={`/product/${product.id}`} key={product.id} className="product-card">
          <div className="image-container">
            <img
              src={`http://localhost:8080${product.imageUrl}`}
              alt={product.name}
            />

            <div className="product-overlay">
              <div className="product-overlay">
                <div className="overlay-content">
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="product-card-body">
            <div className="product-top">
              <h3>{product.name}</h3>

              <span className={`checkbox-label ${product.category}`}>
                {product.category}
              </span>
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            <div className="product-bottom">
              <p className="product-price">${product.price.toFixed(2)}</p>
              <small className="product-owner">By {product.createdByEmail}</small>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}