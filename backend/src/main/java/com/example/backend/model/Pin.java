package com.example.backend.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "pins")
public class Pin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column(name = "user_id")
    private String userId;

    private String headline;

    private String description;

    @ElementCollection
    @CollectionTable(name = "pin_favourites", joinColumns = @JoinColumn(name = "pin_id"))
    @Column(name = "username")
    private Set<String> favouritedBy = new HashSet<>();

    @Column(length = 7, nullable = false)
    private String color = "#3B82F6";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PinCategory category = PinCategory.OTHER;

    public Pin() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Set<String> getFavouritedBy() { return favouritedBy; }
    public void setFavouritedBy(Set<String> favouritedBy) { this.favouritedBy = favouritedBy; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public PinCategory getCategory() { return category; }
    public void setCategory(PinCategory category) { this.category = category; }
}