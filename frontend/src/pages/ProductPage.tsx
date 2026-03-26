import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductPage.css";
import strawberryImg from "../image/strawberry.jpg";
import bananaImg from "../image/banana.png";
import appleImg from "../image/apple.png";

const products = [
  { id: 1, name: "Tank", price: 1.5, image: appleImg, description: "Fresh red apples, perfect for snacking and baking." },
  { id: 2, name: "Banana", price: 0.8, image: bananaImg, description: "Sweet yellow bananas full of potassium and energy." },
  { id: 3, name: "Carrot", price: 1.2, image: "https://via.placeholder.com/400x300?text=Carrot", description: "Organic carrots, crunchy and nutritious." },
  { id: 4, name: "Broccoli", price: 2.0, image: "https://via.placeholder.com/400x300?text=Broccoli", description: "Fresh broccoli, great for cooking or salads." },
  { id: 5, name: "Strawberry", price: 3.5, image: strawberryImg, description: "Juicy strawberries, sweet and fresh from the farm." },
  { id: 6, name: "Tomato", price: 1.8, image: "https://via.placeholder.com/400x300?text=Tomato", description: "Ripe tomatoes, perfect for salads and sauces." },
];

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
      <div className="product-card-container">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="description">{product.description}</p>

          <div className="product-buttons">
            <button>Add to Cart</button>
            <Link to="/store">Back to Store</Link>
          </div>
        </div>
      </div>

      <div className="related-products">
        <h2>Related Products</h2>
        <div className="related-grid">
          {relatedProducts.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="related-card">
              <img src={p.image} alt={p.name} />
              <h3>{p.name}</h3>
              <p className="price">${p.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}