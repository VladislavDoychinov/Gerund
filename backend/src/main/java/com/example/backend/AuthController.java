package com.example.backend;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("User exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request, HttpSession httpSession) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }
        httpSession.setAttribute("userId", user.getId());
        httpSession.setAttribute("userEmail", user.getEmail());
        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "userId", user.getId(),
                "email", user.getEmail()
        ));

    }
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession httpSession) {
        Object userId = httpSession.getAttribute("userId");
        Object userEmail = httpSession.getAttribute("userEmail");

        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not logged in"));
        }

        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "email", userEmail
        ));
    }
}