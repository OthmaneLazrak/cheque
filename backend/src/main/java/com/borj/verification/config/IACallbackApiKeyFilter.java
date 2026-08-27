package com.borj.verification.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class IACallbackApiKeyFilter extends OncePerRequestFilter {

    @Value("${ia.callback.api-key}")
    private String expectedApiKey;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if (request.getRequestURI().startsWith("/api/ia/")) {
            String receivedKey = request.getHeader("X-API-Key");
            if (receivedKey == null || !receivedKey.equals(expectedApiKey)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Cle API invalide");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}