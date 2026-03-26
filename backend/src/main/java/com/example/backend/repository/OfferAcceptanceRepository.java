package com.example.backend.repository;

import com.example.backend.model.OfferAcceptance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OfferAcceptanceRepository extends JpaRepository<OfferAcceptance, Long> {
    List<OfferAcceptance> findBySellerUserIdAndSeenBySellerFalse(Long sellerUserId);

    Optional<OfferAcceptance> findByProductIdAndBuyerUserId(Long productId, Long buyerUserId);
}