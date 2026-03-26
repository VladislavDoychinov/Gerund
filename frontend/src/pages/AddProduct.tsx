import React, { useState, ChangeEvent, FormEvent } from "react";
import "./AddProduct.css";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("0");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description || !image) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const formData = {
      title,
      quantity: Number(quantity),
      price: Number(price),
      description,
      image,
    };

    console.log("Product submitted:", formData);
    alert("Product submitted successfully!");

    setTitle("");
    setQuantity("1");
    setPrice("0");
    setDescription("");
    setImage(null);
    setPreview("");
  };

  return (
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
          <p>Title</p>
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <p>Quantity</p>
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(e.target.value)} // store as string
            required
          />
        </div>

        <div>
          <p>Price</p>
          <input
            type="number"
            placeholder="Price ($)"
            value={price}
            min={0}
            step={0.01}
            onChange={(e) => setPrice(e.target.value)} // store as string
            required
          />
        </div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}