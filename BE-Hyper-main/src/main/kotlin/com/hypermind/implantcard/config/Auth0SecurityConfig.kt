package com.hypermind.implantcard.config

import com.hypermind.implantcard.utils.Auth0Properties
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtDecoders
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class Auth0SecurityConfig {

    @Value("\${auth0.domain}")
    lateinit var domain: String

    // TODO
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { csrf -> csrf.disable() }
            .authorizeHttpRequests { authorizeHttpRequests ->
                authorizeHttpRequests
                    .requestMatchers("/api/auth/**","/h2-console/**","/patients/**","/hospitals/**"
                    ,"/patientImplantInfo/**","/implantInfo/**","/implant-print-history/**").permitAll()
                    .anyRequest().authenticated() // This should be the last call
            }
            .cors { cors -> cors.configure(http) }
            .oauth2ResourceServer { oauth2 ->
                oauth2.jwt { jwt ->
                    jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())
                }
            }
        return http.build()
    }

    @Bean
    fun jwtDecoder(): JwtDecoder {
        // Construct the issuer URL from the domain property
        val issuer = "https://${domain}/" // Ensure domain is correctly set to your Auth0 tenant
        return JwtDecoders.fromOidcIssuerLocation(issuer)
    }

    @Bean
    fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
        return JwtAuthenticationConverter()
    }
}
