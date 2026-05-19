package com.unisell.backend.controller;

import com.unisell.backend.model.Product;
import com.unisell.backend.model.User;
import com.unisell.backend.repository.ProductRepository;
import com.unisell.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private boolean isAdmin(Long userId) {
        return userRepository.findById(userId)
                .map(u -> u.getRole() == User.Role.ADMIN)
                .orElse(false);
    }

    @GetMapping
    public List<Product> getAll(@RequestParam(required = false) Long userId) {
        if (userId != null && !isAdmin(userId)) {
            return productRepository.findByUserId(userId);
        }
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getOne(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Product product) {
        List<Product> scope = product.getUserId() != null
                ? productRepository.findByUserId(product.getUserId())
                : productRepository.findAll();

        boolean duplicate = scope.stream().anyMatch(p ->
            p.getName().equalsIgnoreCase(product.getName()) &&
            p.getCategory().equalsIgnoreCase(product.getCategory())
        );
        if (duplicate) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "A product named \"" + product.getName() + "\" in \"" + product.getCategory() + "\" already exists."));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(productRepository.save(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product updated) {
        return productRepository.findById(id).map(product -> {
            product.setName(updated.getName());
            product.setPrice(updated.getPrice());
            product.setCategory(updated.getCategory());
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!productRepository.existsById(id)) return ResponseEntity.notFound().build();
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
