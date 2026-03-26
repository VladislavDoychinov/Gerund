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
  quantity: number;
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
        <Link to={`/product/${product.id}`} key={product.id}>
          <div className="product-card">
            <img
              src={`http://localhost:8080${product.imageUrl}`}
              alt={product.name}
            />
            <h3>{product.name}</h3>

            <span className={`checkbox-label ${product.category}`}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>

            <p>${product.price.toFixed(2)}</p>
            <small>By {product.createdByEmail}</small>
          </div>
        </Link>
      ))}
    </div>
  );
}