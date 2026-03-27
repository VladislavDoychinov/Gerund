import React, { useState, ChangeEvent, FormEvent } from "react";
import "./AddProduct.css";
import "./Categories.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";


export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("0");
  const [unitMode, setUnitMode] = useState<"unit" | "kg">("unit");
  const [categories, setCategories] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const categoryOptions = ["fruit", "vegetable", "weapon", "meat", "dairy"];

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCategoryChange = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description || !image || categories.length === 0) {
      alert("Please fill all fields, select an image, and choose at least one category.");
      return;
    }

    const computedTotal = (Number(quantity) || 0) * (Number(price) || 0);

    const formData = {
      title,
      quantity: Number(quantity),
      price: Number(price),
      unitMode,
      total: Number(computedTotal.toFixed(2)),
      categories,
      description,
      image,
    };

    console.log("Product submitted:", formData);
    alert("Product submitted successfully!");

    setTitle("");
    setQuantity("1");
    setPrice("0");
    setUnitMode("unit");
    setCategories([]);
    setDescription("");
    setImage(null);
    setPreview("");
  };

  return (
    <>
      <Header />
      <div className="add-product-page">
        <h1>Add New Product</h1>
        <form className="add-product-form" onSubmit={handleSubmit}>
          <label className="image-upload">
            {preview ? (
              <img src={preview} alt="Preview" className="preview-image" />
            ) : (
              <span>Click to upload image</span>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          <div>
            <p className="section-text">Title</p>
            <input
              type="text"
              placeholder="Product Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <p className="section-text">Categories</p>
            <div className="checkbox-group">
              {categoryOptions.map((category) => (
                <label key={category} className={`checkbox-label ${category}`}>
                  <input
                    type="checkbox"
                    checked={categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="section-text">Sell by</p>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="unitMode"
                  value="unit"
                  checked={unitMode === "unit"}
                  onChange={() => setUnitMode("unit")}
                />
                Quantity
              </label>
              <label>
                <input
                  type="radio"
                  name="unitMode"
                  value="kg"
                  checked={unitMode === "kg"}
                  onChange={() => setUnitMode("kg")}
                />
                Weight (kg)
              </label>
            </div>
          </div>

          <div>
            <p className="section-text">Quantity</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Quantity"
                value={quantity}
                min={1}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, "");
                  setQuantity(numericValue === "" ? "" : String(Number(numericValue)));
                }}
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && !["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                required
              />
              {unitMode === "kg" && <span>kg</span>}
            </div>
          </div>

          <div>
            <p className="section-text">Price</p>
            <input
              type="number"
              inputMode="decimal"
              placeholder="Price ($)"
              value={price}
              min={0}
              step={0.01}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9.]/g, "");
                const parts = cleaned.split(".");
                const normalized = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleaned;
                setPrice(normalized);
              }}
              onKeyDown={(e) => {
                const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete", "."];
                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                  e.preventDefault();
                }
                if (e.key === "." && price.includes(".")) {
                  e.preventDefault();
                }
              }}
              required
            />
          </div>

          <div>
            <p className="section-text">Total</p>
            <input
              type="text"
              value={`$${((Number(quantity) || 0) * (Number(price) || 0)).toFixed(2)}`}
              readOnly
            />
          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="description"
          ></textarea>

          <button type="submit">Add Product</button>
        </form>
      </div>
      <Footer />
    </>
  );
}