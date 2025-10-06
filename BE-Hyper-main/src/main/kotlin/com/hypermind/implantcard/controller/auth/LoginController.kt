package com.hypermind.implantcard.controller.auth

import com.hypermind.implantcard.repository.auth.RoleRepository
import com.hypermind.implantcard.repository.auth.UserRepository
import com.hypermind.implantcard.service.auth.Auth0Service
import jakarta.servlet.http.HttpServletRequest
import org.springframework.context.annotation.ComponentScan
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime


@RestController
@RequestMapping("/api/auth")
@ComponentScan("com.hypermind")
class AuthController(
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val auth0Service: Auth0Service,
    private val passwordEncoder: PasswordEncoder // Ensure PasswordEncoder is configured
) {

    @PostMapping("/login")
    fun login(request: HttpServletRequest, @RequestBody loginRequest: LoginRequest): ResponseEntity<Any> {

        // Retrieve user from local database using email
        val user = userRepository.findByEmail(loginRequest.email)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The user does not exist.")

        if (!passwordEncoder.matches(loginRequest.password, user.password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password. Retry.")
        }

        // Call Auth0 to get the token
        val auth0Token = auth0Service.getAuth0Token(loginRequest.email, loginRequest.password)

        if (user.last_login == null) {
            // Set a flag to notify the frontend that this is the first login
            return ResponseEntity.ok(mapOf("message" to "First time login.", "requiresPasswordReset" to true))
        }

        user.last_login = LocalDateTime.now()
        userRepository.save(user)

        // Store tokens in the session
        if (auth0Token != null) {
            request.session.setAttribute("accessToken", auth0Token.access_token)
            request.session.setAttribute("idToken", auth0Token.id_token)
            request.session.setAttribute("tokenType", auth0Token.token_type)
            request.session.setAttribute("expiresIn", auth0Token.expires_in)
        }

        return ResponseEntity.ok(mapOf("token" to auth0Token, "email" to user.email, "role" to user.role.roleName,
            "hospitalId" to user.hospitalId, "message" to "Login successful."))
    }

    @PostMapping("/auth0-password-reset")
    fun handlePasswordReset(@RequestBody payload: Map<String, Any>): ResponseEntity<String> {
        val email = payload["email"] as String? ?: return ResponseEntity.badRequest().body("Email not found in payload.")
        val newPassword = payload["new_password"] as String? ?: return ResponseEntity.badRequest().body("New password not found.")

        // Retrieve user from local DB
        val user = userRepository.findByEmail(email)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.")

        // Update the password in the local database
        user.password = passwordEncoder.encode(newPassword)
        userRepository.save(user)

        return ResponseEntity.ok("Password updated successfully.")
    }

}


data class LoginRequest(val email: String, val password: String)
data class LoginResponse(val authenticated: Boolean, val user_id: String? = null, val email: String? = null,
                         val role: String? = null)
