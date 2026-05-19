package com.unisell.backend.controller;

import com.unisell.backend.model.Order;
import com.unisell.backend.model.User;
import com.unisell.backend.repository.OrderRepository;
import com.unisell.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    private boolean isAdmin(Long userId) {
        return userRepository.findById(userId)
                .map(u -> u.getRole() == User.Role.ADMIN)
                .orElse(false);
    }

    @GetMapping
    public List<Order> getAll(@RequestParam(required = false) Long userId) {
        if (userId != null && !isAdmin(userId)) {
            return orderRepository.findByUserId(userId);
        }
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOne(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Order order) {
        List<Order> scope = order.getUserId() != null
                ? orderRepository.findByUserId(order.getUserId())
                : orderRepository.findAll();

        boolean duplicate = scope.stream().anyMatch(o ->
            o.getCustomer().equalsIgnoreCase(order.getCustomer()) &&
            o.getPlatform().equalsIgnoreCase(order.getPlatform()) &&
            o.getProduct().equalsIgnoreCase(order.getProduct()) &&
            o.getAmount().equals(order.getAmount()) &&
            o.getStatus().equalsIgnoreCase(order.getStatus()) &&
            o.getDate() != null && o.getDate().equals(order.getDate())
        );
        if (duplicate) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "A duplicate order with the same details already exists."));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(orderRepository.save(order));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> update(@PathVariable Long id, @RequestBody Order updated) {
        return orderRepository.findById(id).map(order -> {
            order.setCustomer(updated.getCustomer());
            order.setPlatform(updated.getPlatform());
            order.setProduct(updated.getProduct());
            order.setAmount(updated.getAmount());
            order.setStatus(updated.getStatus());
            order.setDate(updated.getDate());
            return ResponseEntity.ok(orderRepository.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) return ResponseEntity.notFound().build();
        orderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
