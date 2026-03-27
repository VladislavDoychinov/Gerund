import React, { useState } from "react";
import "./Reviews.css";

interface Review {
  id: number;
  author: string;
  text: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, author: "John", text: "Great product!" },
    { id: 2, author: "Anna", text: "Really liked it 👍" },
  ]);

  const [newReview, setNewReview] = useState("");

  const addReview = () => {
    if (!newReview.trim()) return;

    const review: Review = {
      id: Date.now(),
      author: "You",
      text: newReview,
    };

    setReviews([review, ...reviews]);
    setNewReview("");
  };

  return (
    <div className="reviews">
      <h3>Reviews</h3>

      <div className="review-input">
        <textarea
          placeholder="Write a review..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        <button onClick={addReview}>Post</button>
      </div>

      <div className="review-list">
        {reviews.map((r) => (
          <div key={r.id} className="review-card">
            <strong>{r.author}</strong>
            <p>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}