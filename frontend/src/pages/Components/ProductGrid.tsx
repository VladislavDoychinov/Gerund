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
        <Link
          to={`/product/${product.id}`}
          key={product.id}
          className="product-card"
        >
          <div className="image-container">
            <img
              src={product.imageUrl.startsWith("http") ? product.imageUrl : `http://localhost:8080${product.imageUrl}`}
              alt={product.name}
            />
          </div>

          <div className="product-card-body">
            <div className="product-top">
              <h3>{product.name}</h3>

              <label className={`checkbox-label ${product.category.toLowerCase()}`}>
                <input type="checkbox" checked readOnly />
                <span>{product.category}</span>
              </label>
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