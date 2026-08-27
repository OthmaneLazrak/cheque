package com.borj.verification.config;

import org.springframework.context.annotation.Configuration; import org.springframework.web.servlet.config.annotation.CorsRegistry; import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**

 Sans ceci, le navigateur bloque tous les appels du front (port 5173
 ou 3000) vers Spring (port 8081), alors que curl fonctionne.
 C'est la premiere source de "mon tableau est vide" cote front. */
@Configuration public class CorsConfig implements WebMvcConfigurer {
    @Override public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins( "http://localhost:5173")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}
