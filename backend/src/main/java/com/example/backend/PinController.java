package com.example.backend;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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
    
    @GetMapping("/user/{userId:.+}")
    public List<Pin> getPinsByUser(@PathVariable String userId) {
        return repository.findByUserId(userId);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public Pin addPin(
            @RequestPart("pin") Pin pin, 
            @RequestPart(value = "image", required = false) MultipartFile file) throws IOException {
        
        if (file != null && !file.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads").toAbsolutePath().normalize();
            
            if (!Files.exists(path)) Files.createDirectories(path);
            
            Files.write(path.resolve(fileName), file.getBytes());
            pin.setImageUrl("/uploads/" + fileName);
        }
        
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