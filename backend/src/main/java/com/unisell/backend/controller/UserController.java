package com.unisell.backend.controller;

import com.unisell.backend.model.User;
import com.unisell.backend.repository.UserRepository;
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

    @PostMapping
    public User create(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User updated) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(updated.getEmail());
            user.setUsername(updated.getUsername());
            user.setPassword(updated.getPassword());
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String input = body.get("emailOrUsername").toLowerCase().trim();
        String password = body.get("password");

        return userRepository.findByEmail(input)
                .or(() -> userRepository.findByUsername(input))
                .filter(u -> u.getPassword().equals(password))
                .map(u -> ResponseEntity.ok((Object) u))
                .orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }
}