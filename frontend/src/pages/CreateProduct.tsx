import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import "./CreateProduct.css";

const categories = [
  "fruit",
  "vegetable",
  "dairy",
  "meat",
  "bakery",
  "drinks",
  "other",
];

export default function CreateProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantityValue, setQuantityValue] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const quantityUnit = useMemo(() => {
    return category === "fruit" || category === "vegetable" ? "kg" : "pcs";
  }, [category]);

  const quantityLabel =
    quantityUnit === "kg" ? "Quantity in kilograms" : "Quantity count";

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) return setMessage("Please choose an image.");
    if (!category) return setMessage("Please choose a category.");

    if (isNaN(Number(price)) || Number(price) <= 0) {
      return setMessage("Invalid price.");
    }

    if (isNaN(Number(quantityValue)) || Number(quantityValue) <= 0) {
      return setMessage("Invalid quantity.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("quantityValue", quantityValue);
    formData.append("quantityUnit", quantityUnit);
    formData.append("category", category);
    formData.append("image", image);

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:8080/api/products/create",
        formData,
        { withCredentials: true }
      );

      setMessage("Product created successfully.");

      if (response.data?.id) {
        navigate(`/product/${response.data.id}`);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <Header />

      <div className="create-container">
        <div className="create-grid">

          <div className="create-card">
            <div className="create-header">
              <h1>Create a Product</h1>
              <p>
                Add your product details, upload an image, and list it on the marketplace.
              </p>
            </div>

            {message && <div className="create-message">{message}</div>}

            <form onSubmit={handleSubmit} className="create-form">

              <div className="form-group">
                <label>Product name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setPrice(value);
                      }
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Choose category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{quantityLabel}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={quantityValue}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (quantityUnit === "kg") {
                        if (/^\d*\.?\d*$/.test(value)) {
                          setQuantityValue(value);
                        }
                      } else {
                        if (/^\d*$/.test(value)) {
                          setQuantityValue(value);
                        }
                      }
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unit</label>
                  <input value={quantityUnit} readOnly className="readonly" />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Product image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Creating..." : "Create Product"}
              </button>
            </form>
          </div>
          
          <div className="preview-card">
            <h2>Live Preview</h2>

            <div className="preview-image">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" />
              ) : (
                <span>Image preview will appear here</span>
              )}
            </div>

            <div className="preview-content">
              <h3>{name || "Your product name"}</h3>
              <p className="preview-category">
                {category || "Choose a category"}
              </p>
              <p className="preview-price">
                {price ? `$${Number(price).toFixed(2)}` : "$0.00"}
              </p>
              <p>
                {quantityValue
                  ? `Quantity: ${quantityValue} ${quantityUnit}`
                  : "Quantity will appear here"}
              </p>
              <p className="preview-description">
                {description || "Your description will appear here."}
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}