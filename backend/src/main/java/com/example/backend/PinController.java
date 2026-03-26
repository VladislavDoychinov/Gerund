package com.example.backend;

import com.example.backend.model.Pin;
import com.example.backend.repository.PinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping
    public Pin addPin(@RequestBody Pin pin) {
        return repository.save(pin);
    }

    @DeleteMapping("/{id}")
    public void deletePin(@PathVariable Long id) {
        repository.deleteById(id);
    }
}