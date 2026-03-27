package com.example.backend;

import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public Pin toggleFavourite(@PathVariable Long id, @RequestParam String userId) {
        Pin pin = repository.findById(id).orElseThrow();
        Set<String> favourites = pin.getFavouritedBy();
        
        if (favourites.contains(userId)) {
            favourites.remove(userId);
        } else {
            favourites.add(userId);
        }
        
        return repository.save(pin);
    }
}