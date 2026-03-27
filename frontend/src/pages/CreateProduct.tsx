import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import "./StorePage.css";

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

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const quantityUnit = useMemo(() => {
    if (category === "fruit" || category === "vegetable") {
      return "kg";
    }
    return "pcs";
  }, [category]);

  const quantityLabel =
    quantityUnit === "kg" ? "Quantity in kilograms" : "Quantity count";

  const previewUrl = image ? URL.createObjectURL(image) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setMessage("Please choose an image.");
      return;
    }

    if (!category) {
      setMessage("Please choose a category.");
      return;
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
        {
          withCredentials: true,
        }
      );

      setMessage("Product created successfully.");

      setName("");
      setPrice("");
      setDescription("");
      setQuantityValue("");
      setCategory("");
      setImage(null);

      if (response.data?.id) {
        navigate(`/product/${response.data.id}`);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to create product.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="store-page">
      <Header />

      <div
        style={{
          minHeight: "calc(100vh - 160px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          background:
            "linear-gradient(180deg, #f7f9fc 0%, #eef3f9 100%)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "920px",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "24px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#1f2937",
                }}
              >
                Create a Product
              </h1>
              <p
                style={{
                  marginTop: "10px",
                  color: "#6b7280",
                  lineHeight: 1.5,
                }}
              >
                Add your product details, upload an image, and list it on the
                marketplace.
              </p>
            </div>

            {message && (
              <div
                style={{
                  marginBottom: "18px",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: "#f3f4f6",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {message}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              <div style={{ display: "grid", gap: "8px" }}>
                <label style={{ fontWeight: 700, color: "#374151" }}>
                  Product name
                </label>
                <input
                  type="text"
                  placeholder="Example: Fresh Tomatoes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div style={{ display: "grid", gap: "8px" }}>
                  <label style={{ fontWeight: 700, color: "#374151" }}>
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Example: 4.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: "grid", gap: "8px" }}>
                  <label style={{ fontWeight: 700, color: "#374151" }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    style={inputStyle}
                  >
                    <option value="">Choose category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 160px",
                  gap: "16px",
                }}
              >
                <div style={{ display: "grid", gap: "8px" }}>
                  <label style={{ fontWeight: 700, color: "#374151" }}>
                    {quantityLabel}
                  </label>
                  <input
                    type="number"
                    step={quantityUnit === "kg" ? "0.1" : "1"}
                    min="0"
                    placeholder={quantityLabel}
                    value={quantityValue}
                    onChange={(e) => setQuantityValue(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: "grid", gap: "8px" }}>
                  <label style={{ fontWeight: 700, color: "#374151" }}>
                    Unit
                  </label>
                  <input
                    type="text"
                    value={quantityUnit}
                    readOnly
                    style={{
                      ...inputStyle,
                      background: "#f9fafb",
                      fontWeight: 700,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gap: "8px" }}>
                <label style={{ fontWeight: 700, color: "#374151" }}>
                  Description
                </label>
                <textarea
                  placeholder="Describe your product..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: "120px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gap: "8px" }}>
                <label style={{ fontWeight: 700, color: "#374151" }}>
                  Product image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  required
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "8px",
                  border: "none",
                  borderRadius: "14px",
                  padding: "14px 18px",
                  fontSize: "1rem",
                  fontWeight: 800,
                  background: "#111827",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                {loading ? "Creating..." : "Create Product"}
              </button>
            </form>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "#1f2937",
              }}
            >
              Live Preview
            </h2>

            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                background: "#f3f4f6",
                minHeight: "280px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "280px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span style={{ color: "#6b7280", fontWeight: 600 }}>
                  Image preview will appear here
                </span>
              )}
            </div>

            <div>
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "1.2rem",
                  color: "#111827",
                }}
              >
                {name || "Your product name"}
              </h3>

              <p style={{ margin: "0 0 10px 0", color: "#6b7280" }}>
                {category
                  ? category.charAt(0).toUpperCase() + category.slice(1)
                  : "Choose a category"}
              </p>

              <p
                style={{
                  margin: "0 0 10px 0",
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {price ? `$${Number(price).toFixed(2)}` : "$0.00"}
              </p>

              <p style={{ margin: "0 0 10px 0", color: "#374151" }}>
                {quantityValue
                  ? `Quantity: ${quantityValue} ${quantityUnit}`
                  : "Quantity will appear here"}
              </p>

              <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: "14px",
  padding: "14px 16px",
  fontSize: "1rem",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
};