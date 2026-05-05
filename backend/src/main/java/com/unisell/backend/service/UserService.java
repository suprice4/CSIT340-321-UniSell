package com.unisell.backend.service;

import com.unisell.backend.model.User;
import com.unisell.backend.model.User.Role;
import com.unisell.backend.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Value("${jwt.secret:dGhpcy1pcy1hLXNlY3JldC1rZXktZm9yLWRldi11c2Utb25seQ==}")
    private String jwtSecretBase64;

    @Value("${jwt.expiration-ms:86400000}") // 24 hours
    private long jwtExpirationMs;

    public User register(String email, String username, String password, Role role) {
        String normalEmail    = email.toLowerCase().trim();
        String normalUsername = username.trim();

        if (userRepository.existsByEmail(normalEmail)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
        if (userRepository.existsByUsername(normalUsername)) {
            throw new IllegalArgumentException("This username is already taken.");
        }

        User user = new User();
        user.setEmail(normalEmail);
        user.setUsername(normalUsername);
        user.setPassword(password);           
        user.setRole(role);

        return userRepository.save(user);
    }

    public Map<String, Object> login(String emailOrUsername, String password) {
        String input = emailOrUsername.toLowerCase().trim();

        Optional<User> found = userRepository.findByEmail(input)
                .or(() -> userRepository.findByUsername(input));

        User user = found
                .filter(u -> u.getPassword().equals(password))
                .orElseThrow(() -> new IllegalArgumentException("Invalid email/username or password."));

        String token = generateToken(user);

        Map<String, Object> response = new HashMap<>();
        response.put("token",    token);
        response.put("id",       user.getId());
        response.put("email",    user.getEmail());
        response.put("username", user.getUsername());
        response.put("role",     user.getRole().name());
        return response;
    }

    private String generateToken(User user) {
        Key key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecretBase64));

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role",  user.getRole().name())
                .claim("email", user.getEmail())
                .claim("id",    user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Key key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecretBase64));
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        Key key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecretBase64));
        return Jwts.parserBuilder()
                .setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}