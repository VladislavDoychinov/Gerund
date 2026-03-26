package com.example.backend.controller;

import com.example.backend.model.OfferAcceptance;
import com.example.backend.repository.OfferAcceptanceRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {

    private final OfferAcceptanceRepository offerAcceptanceRepository;

    public NotificationController(OfferAcceptanceRepository offerAcceptanceRepository) {
        this.offerAcceptanceRepository = offerAcceptanceRepository;
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(HttpSession session) {
        Object sellerUserIdObj = session.getAttribute("userId");

        if (sellerUserIdObj == null) {
            return ResponseEntity.status(401).body(Map.of("message", "You must be logged in"));
        }

        Long sellerUserId = Long.valueOf(sellerUserIdObj.toString());

        return ResponseEntity.ok(
                offerAcceptanceRepository.findBySellerUserIdAndSeenBySellerFalse(sellerUserId)
        );
    }

    @PutMapping("/{id}/seen")
    public ResponseEntity<?> markNotificationSeen(@PathVariable Long id, HttpSession session) {
        Object sellerUserIdObj = session.getAttribute("userId");

        if (sellerUserIdObj == null) {
            return ResponseEntity.status(401).body(Map.of("message", "You must be logged in"));
        }

        Long sellerUserId = Long.valueOf(sellerUserIdObj.toString());

        var optionalNotification = offerAcceptanceRepository.findById(id);

        if (optionalNotification.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Notification not found"));
        }

        OfferAcceptance notification = optionalNotification.get();

        if (!notification.getSellerUserId().equals(sellerUserId)) {
            return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
        }

        notification.setSeenBySeller(true);
        offerAcceptanceRepository.save(notification);

        return ResponseEntity.ok(Map.of("message", "Notification marked as seen"));
    }
}