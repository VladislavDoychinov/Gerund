package com.example.backend.controller;

import com.example.backend.model.OfferAcceptance;
import com.example.backend.model.Product;
import com.example.backend.repository.OfferAcceptanceRepository;
import com.example.backend.repository.ProductRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProductController {

    private final ProductRepository productRepository;
    private final OfferAcceptanceRepository offerAcceptanceRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public ProductController(ProductRepository productRepository,
                             OfferAcceptanceRepository offerAcceptanceRepository) {
        this.productRepository = productRepository;
        this.offerAcceptanceRepository = offerAcceptanceRepository;
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptOffer(@PathVariable Long id, HttpSession session) {
        Object buyerUserIdObj = session.getAttribute("userId");
        Object buyerEmailObj = session.getAttribute("userEmail");

        if (buyerUserIdObj == null || buyerEmailObj == null) {
            return ResponseEntity.status(401).body(Map.of("message", "You must be logged in"));
        }

        Long buyerUserId = Long.valueOf(buyerUserIdObj.toString());
        String buyerEmail = buyerEmailObj.toString();

        var optionalProduct = productRepository.findById(id);

        if (optionalProduct.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Product not found"));
        }

        Product product = optionalProduct.get();

        if (product.getCreatedByUserId().equals(buyerUserId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "You cannot accept your own offer"));
        }

        var existingAcceptance =
                offerAcceptanceRepository.findByProductIdAndBuyerUserId(product.getId(), buyerUserId);

        if (existingAcceptance.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "You already accepted this offer"));
        }

        OfferAcceptance acceptance = new OfferAcceptance();
        acceptance.setProductId(product.getId());
        acceptance.setProductName(product.getName());
        acceptance.setSellerUserId(product.getCreatedByUserId());
        acceptance.setSellerEmail(product.getCreatedByEmail());
        acceptance.setBuyerUserId(buyerUserId);
        acceptance.setBuyerEmail(buyerEmail);
        acceptance.setSeenBySeller(false);

        offerAcceptanceRepository.save(acceptance);

        return ResponseEntity.ok(Map.of(
                "message", "Offer accepted successfully",
                "sellerEmail", product.getCreatedByEmail()
        ));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createProduct(
            @RequestParam String name,
            @RequestParam double price,
            @RequestParam String description,
            @RequestParam double quantityValue,
            @RequestParam String quantityUnit,
            @RequestParam String category,
            @RequestParam("image") MultipartFile image,
            HttpSession session
    ) {
        Object userIdObj = session.getAttribute("userId");
        Object userEmailObj = session.getAttribute("userEmail");

        if (userIdObj == null || userEmailObj == null) {
            return ResponseEntity.status(401).body(Map.of("message", "You must be logged in"));
        }

        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Product name is required"));
        }

        if (description == null || description.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Description is required"));
        }

        if (category == null || category.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Category is required"));
        }

        if (quantityUnit == null || quantityUnit.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Quantity unit is required"));
        }

        if (quantityValue <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Quantity must be greater than zero"));
        }

        if (price < 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Price cannot be negative"));
        }

        if (image == null || image.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Image is required"));
        }

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String originalFilename = StringUtils.cleanPath(image.getOriginalFilename());
            String extension = "";

            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex != -1) {
                extension = originalFilename.substring(dotIndex);
            }

            String fileName = UUID.randomUUID() + extension;
            Path targetPath = uploadPath.resolve(fileName);

            Files.copy(image.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            Product product = new Product();
            product.setName(name);
            product.setPrice(price);
            product.setDescription(description);
            product.setQuantityValue(quantityValue);
            product.setQuantityUnit(quantityUnit);
            product.setCategory(category);
            product.setImageUrl("/uploads/" + fileName);
            product.setCreatedByUserId(Long.valueOf(userIdObj.toString()));
            product.setCreatedByEmail(userEmailObj.toString());

            productRepository.save(product);

            return ResponseEntity.ok(product);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to save product"));
        }
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "Product not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, HttpSession session) {
        Object userIdObj = session.getAttribute("userId");

        if (userIdObj == null) {
            return ResponseEntity.status(401).body(Map.of("message", "You must be logged in"));
        }

        Long currentUserId = Long.valueOf(userIdObj.toString());

        var optionalProduct = productRepository.findById(id);

        if (optionalProduct.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Product not found"));
        }

        Product product = optionalProduct.get();

        if (!product.getCreatedByUserId().equals(currentUserId)) {
            return ResponseEntity.status(403).body(Map.of("message", "You can only delete your own products"));
        }

        productRepository.delete(product);

        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }
}