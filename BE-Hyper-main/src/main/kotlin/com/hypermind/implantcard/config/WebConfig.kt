package com.hypermind.implantcard.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**") // Apply CORS to all endpoints
            .allowedOrigins(
                "http://localhost:3000", // React dev server
                "http://localhost:8080",
                "http://3.110.182.172:3000",
                "http://3.110.182.172:8080",
                "https://implantweb.vercel.app", //Production frontend,
                "https://implant.hyperminds.tech"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
            .allowedHeaders("*") // Allow all headers
            .allowCredentials(true) // Allow cookies/auth headers
    }
}
