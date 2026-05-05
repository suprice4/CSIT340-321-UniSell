package com.unisell.backend.filter;

import com.unisell.backend.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private UserService userService;

    // Paths that do NOT require a token
    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/users/login",
            "/api/users/register"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        boolean isPublic = PUBLIC_PATHS.stream().anyMatch(path::startsWith)
                || "OPTIONS".equalsIgnoreCase(request.getMethod()); // preflight

        if (isPublic) {
            chain.doFilter(request, response);
            return;
        }

        // Require Authorization: Bearer <token>
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or malformed Authorization header.");
            return;
        }

        String token = authHeader.substring(7);
        if (!userService.validateToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or expired token.");
            return;
        }

        chain.doFilter(request, response);
    }
}