import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Reviews.css";

interface ReviewItem {
  id: number;
  authorEmail: string;
  text: string;
  rating: number;
  createdAt: string;
}

interface CurrentUser {
  userId: number;
  email: string;
}

interface ReviewsProps {
  productId: number;
  productName: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export default function Reviews({ productId, productName }: ReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [message, setMessage] = useState("");

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/me", { withCredentials: true })
      .then((res) => setCurrentUser(res.data))
      .catch(() => setCurrentUser(null));
  }, []);

  const loadReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/reviews/${productId}`);
      setReviews(res.data);
    } catch (error) {
      setReviews([]);
    }
  };

  const addReview = async () => {
    setMessage("");

    if (!currentUser) {
      setMessage("You need to be logged in to post a review.");
      return;
    }

    if (!newReview.trim()) {
      setMessage("Write something before posting.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/api/reviews/${productId}`,
        {
          text: newReview.trim(),
          rating: String(rating),
        },
        { withCredentials: true }
      );

      setReviews((prev) => [res.data, ...prev]);
      setNewReview("");
      setRating(5);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to post review.");
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, {
        withCredentials: true,
      });

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to delete review.");
    }
  };

  return (
    <div className="reviews">
      <div className="reviews-header">
        <div>
          <h3>Reviews</h3>
          <p className="reviews-subtitle">What people think about {productName}</p>
        </div>

        <div className="reviews-summary">
          <strong>{averageRating ?? "—"}</strong>
          <span>{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div className="review-input">
        <label className="review-label">Your rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="review-select"
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Good</option>
          <option value={3}>3 - Okay</option>
          <option value={2}>2 - Poor</option>
          <option value={1}>1 - Bad</option>
        </select>

        <label className="review-label">Your review</label>
        <textarea
          placeholder={currentUser ? "Write your review..." : "Log in to write a review..."}
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />

        {message && <p className="review-message">{message}</p>}

        <button onClick={addReview}>Post Review</button>
      </div>

      <div className="review-list">
        {reviews.length === 0 ? (
          <div className="review-empty">No reviews yet. Be the first to leave one.</div>
        ) : (
          reviews.map((review) => {
            const isOwnReview = currentUser?.email === review.authorEmail;

            return (
              <div key={review.id} className="review-card">
                <div className="review-card-top">
                  <div>
                    <strong>{review.authorEmail}</strong>
                    <div className="review-stars">{renderStars(review.rating)}</div>
                  </div>

                  <div className="review-meta">
                    <span>{formatDate(review.createdAt)}</span>
                    {isOwnReview && (
                      <button
                        className="review-delete"
                        onClick={() => deleteReview(review.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <p>{review.text}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}