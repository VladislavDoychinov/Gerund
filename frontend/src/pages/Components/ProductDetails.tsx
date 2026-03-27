import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../ProductPage.css";
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

interface CurrentUser {
  userId: number;
  email: string;
}

export default function ProductDetails({ product }: { product: Product }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/auth/me", {
        withCredentials: true,
      });
      setCurrentUser(result.data);
    } catch (error) {
      setCurrentUser(null);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${product.id}`, {
        withCredentials: true,
      });

      navigate("/store");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleAcceptOffer = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/products/${product.id}/accept`,
        {},
        { withCredentials: true }
      );

      setMessage(
        `Offer accepted. Contact the seller at ${response.data.sellerEmail}`
      );
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to accept offer");
    }
  };

  const isOwner = currentUser?.email === product.createdByEmail;

  return (
    <div className="product-card-container">
      <div className="product-image">
        <img
          src={`http://localhost:8080${product.imageUrl}`}
          alt={product.name}
        />
      </div>

      <div className="product-details">
        <div className="product-header">
          <h1>{product.name}</h1>

          <span className={`checkbox-label ${product.category}`}>
            {product.category}
          </span>
        </div>

        <p className="price">${product.price.toFixed(2)}</p>

        <p className="quantity">
          Quantity: {product.quantityValue} {product.quantityUnit}
        </p>

        <p className="description">{product.description}</p>

        <p className="created-by">
          Listed by{" "}
          <Link to={`/account/${encodeURIComponent(product.createdByEmail)}`}>
            {product.createdByEmail}
          </Link>
        </p>

        {message && <p className="status-message">{message}</p>}

        <div className="product-buttons">
          {isOwner ? (
            <button onClick={handleDelete}>Delete Product</button>
          ) : (
            <button onClick={handleAcceptOffer}>Add to cart</button>
          )}

          <Link to="/store">Back to Store</Link>
        </div>
      </div>
    </div>
  );
}