package com.example.backend;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.repository.PinRepository;
import com.example.backend.model.Pin;

@RestController
@RequestMapping("/api/pins")
@CrossOrigin(origins = "http://localhost:3000")
public class PinController {

    @Autowired
    private PinRepository repository;

    @GetMapping
    public List<Pin> getAllPins() {
        return repository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Pin> getPinsByUser(@PathVariable String userId) {
        return repository.findByUserId(userId);
    }

    @PostMapping
    public Pin addPin(@RequestBody Pin pin) {
        return repository.save(pin);
    }

    @DeleteMapping("/{id}")
    public void deletePin(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PatchMapping("/{id}/favourite")
    public Pin toggleFavourite(@PathVariable Long id) {
        Pin pin = repository.findById(id).orElseThrow();
        pin.setFavourite(!pin.getFavourite());
        return repository.save(pin);
    }
}