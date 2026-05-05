package com.unisell.backend.controller;

import com.unisell.backend.model.User;
import com.unisell.backend.model.User.Role;
import com.unisell.backend.repository.UserRepository;
import com.unisell.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getOne(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email    = body.getOrDefault("email", "").trim();
        String username = body.getOrDefault("username", "").trim();
        String password = body.getOrDefault("password", "");
        String roleStr  = body.getOrDefault("role", "VENDOR").toUpperCase();

        if (email.isEmpty() || username.isEmpty() || password.isEmpty()) {
            return ResponseEntity.badRequest().body("Email, username, and password are required.");
        }

        Role role;
        try {
            role = Role.valueOf(roleStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role: " + roleStr);
        }

        try {
            User saved = userService.register(email, username, password, role);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            // "email already exists" or "username already taken"
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String emailOrUsername = body.getOrDefault("emailOrUsername", "");
        String password        = body.getOrDefault("password", "");

        try {
            Map<String, Object> result = userService.login(emailOrUsername, password);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User updated) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(updated.getEmail());
            user.setUsername(updated.getUsername());
            if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
                user.setPassword(updated.getPassword());
            }
            user.setRole(updated.getRole());
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}