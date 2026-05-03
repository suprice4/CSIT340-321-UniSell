package com.unisell.backend.controller;

import com.unisell.backend.model.Order;
import com.unisell.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOne(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        return orderRepository.save(order);
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