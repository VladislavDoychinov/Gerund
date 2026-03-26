import React from "react";
import { useParams, Link } from "react-router-dom";

const products = [
  { id: 1, name: "Apple", price: 1.5, image: "", description: "Fresh apples." },
  { id: 2, name: "Banana", price: 0.8, image: "", description: "Sweet bananas." },
  { id: 3, name: "Carrot", price: 1.5, image: "", description: "Orange carrots." },
  { id: 4, name: "Broccoli", price: 0.8, image: "", description: "Chewy broccoli." },
  { id: 5, name: "Strawberry", price: 1.5, image: "", description: "Fresh strawberry." },
  { id: 6, name: "Tomato", price: 0.8, image: "", description: "Red tomatoes." },
];

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === Number(id));

  if (!product) return <p>Product not found. <Link to="/store">Back to Store</Link></p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link to="/store" className="text-blue-500 underline mb-4 inline-block">&larr; Back to Store</Link>
      <div className="bg-white p-6 rounded-2xl shadow">
        <img src={product.image} alt={product.name} className="w-full rounded-lg mb-4" />
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-lg font-semibold mb-4">${product.price.toFixed(2)}</p>
        <p className="mb-4">{product.description}</p>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add to Cart</button>
      </div>
    </div>
  );
}