package com.unisell.backend.controller;

import com.unisell.backend.model.Platform;
import com.unisell.backend.model.User;
import com.unisell.backend.repository.PlatformRepository;
import com.unisell.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/platforms")
@CrossOrigin(origins = "http://localhost:3000")
public class PlatformController {

    @Autowired
    private PlatformRepository platformRepository;

    @Autowired
    private UserRepository userRepository;

    private boolean isAdmin(Long userId) {
        return userRepository.findById(userId)
                .map(u -> u.getRole() == User.Role.ADMIN)
                .orElse(false);
    }

    @GetMapping
    public List<Platform> getAll(@RequestParam(required = false) Long userId) {
        if (userId != null && !isAdmin(userId)) {
            return platformRepository.findByUserId(userId);
        }
        return platformRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Platform> getOne(@PathVariable Long id) {
        return platformRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Platform platform) {
        // Duplicate name check scoped to the same user
        boolean duplicate = platform.getUserId() != null
                ? platformRepository.existsByNameIgnoreCaseAndUserId(platform.getName(), platform.getUserId())
                : platformRepository.findByNameIgnoreCase(platform.getName()).isPresent();

        if (duplicate) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "A platform named \"" + platform.getName() + "\" already exists."));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(platformRepository.save(platform));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Platform updated) {
        boolean duplicate = updated.getUserId() != null
                ? platformRepository.existsByNameIgnoreCaseAndUserIdAndIdNot(updated.getName(), updated.getUserId(), id)
                : platformRepository.existsByNameIgnoreCaseAndIdNot(updated.getName(), id);

        if (duplicate) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "A platform named \"" + updated.getName() + "\" already exists."));
        }
        return platformRepository.findById(id).map(platform -> {
            platform.setName(updated.getName());
            platform.setUrl(updated.getUrl());
            platform.setStatus(updated.getStatus());
            platform.setDescription(updated.getDescription());
            return ResponseEntity.ok(platformRepository.save(platform));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!platformRepository.existsById(id)) return ResponseEntity.notFound().build();
        platformRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
