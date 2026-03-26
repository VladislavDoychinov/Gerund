import React from "react";
import { Link } from "react-router-dom";
import "./StorePage.css";
import strawberryImg from "../image/strawberry.jpg";
import bananaImg from "../image/banana.png";
import appleImg from "../image/apple.png"

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const products: Product[] = [
  { id: 1, name: "Tank", price: 1.5, image: appleImg },
  { id: 2, name: "Banana", price: 0.8, image: bananaImg },
  { id: 3, name: "Carrot", price: 1.2, image: "https://via.placeholder.com/150?text=Carrot" },
  { id: 4, name: "Broccoli", price: 2.0, image: "https://via.placeholder.com/150?text=Broccoli" },
  { id: 5, name: "Strawberry", price: 3.5, image: strawberryImg },
  { id: 6, name: "Tomato", price: 1.8, image: "https://via.placeholder.com/150?text=Tomato" },
];

export default function StorePage() {
  return (
  <div className="store-page">
    <header className="store-header">
      <h1>Marketplace</h1>
    </header>

    <div className="product-grid">
      {products.map((product) => (
        <Link to={`/product/${product.id}`} key={product.id}>
          <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);
}