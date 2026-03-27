package com.example.backend.controller;

import com.example.backend.model.Review;
import com.example.backend.repository.ReviewRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/{productId}")
    public List<Review> getReviewsByProduct(@PathVariable Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> createReview(
            @PathVariable Long productId,
            @RequestBody Map<String, String> body,
            HttpSession session
    ) {
        Object userEmailObj = session.getAttribute("userEmail");

        if (userEmailObj == null) {
            return ResponseEntity.status(401).body(Map.of("message", "You must be logged in"));
        }

        String text = body.get("text");
        String ratingValue = body.get("rating");

        if (text == null || text.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Review text is required"));
        }

        int rating;
        try {
            rating = Integer.parseInt(ratingValue);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid rating"));
        }

        if (rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().body(Map.of("message", "Rating must be between 1 and 5"));
        }

        Review review = new Review();
        review.setProductId(productId);
        review.setAuthorEmail(userEmailObj.toString());
        review.setText(text.trim());
        review.setRating(rating);
        review.setCreatedAt(LocalDateTime.now());

        reviewRepository.save(review);

        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, HttpSession session) {
        Object userEmailObj = session.getAttribute("userEmail");

        if (userEmailObj == null) {
            return ResponseEntity.status(401).body(Map.of("message", "You must be logged in"));
        }

        String currentUserEmail = userEmailObj.toString();

        var optionalReview = reviewRepository.findByIdAndAuthorEmail(reviewId, currentUserEmail);

        if (optionalReview.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("message", "You can only delete your own reviews"));
        }

        reviewRepository.delete(optionalReview.get());

        return ResponseEntity.ok(Map.of("message", "Review deleted"));
    }
}