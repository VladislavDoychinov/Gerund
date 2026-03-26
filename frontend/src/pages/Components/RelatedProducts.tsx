import React from "react";
import { Link } from "react-router-dom";
import "../ProductPage.css";

export default function RelatedProducts({ products }: { products: any[] }) {
  return (
    <div className="related-products">
      <h2>Related Products</h2>
      <div className="related-grid">
        {products.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="related-card">
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p className="price">${p.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}