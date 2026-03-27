import React from "react";
import { Link } from "react-router-dom";
import "../ProductPage.css";

export default function RelatedProducts({ products }: { products: any[] }) {
  return (
    <div className="related-products">
      <h2>Related Products</h2>
      <div className="related-grid">
        {products.map((p) => {
          const relatedImg = p.imageUrl
            ? p.imageUrl.startsWith("http")
              ? p.imageUrl
              : `http://localhost:8080${p.imageUrl}`
            : p.image || "/placeholder.png";

          const price = typeof p.price === "number" ? p.price : Number(p.price) || 0;

          return (
            <Link key={p.id} to={`/product/${p.id}`} className="related-card">
              <img src={relatedImg} alt={p.name || "related product"} />
              <h3>{p.name || "Unnamed Product"}</h3>
              <p className="price">${price.toFixed(2)}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
