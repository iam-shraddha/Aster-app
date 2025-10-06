package com.hypermind.implantcard.controller.auth

import com.hypermind.implantcard.model.auth.User
import com.hypermind.implantcard.repository.auth.RoleRepository
import com.hypermind.implantcard.repository.auth.UserRepository
import com.hypermind.implantcard.service.auth.Auth0Service
import com.hypermind.implantcard.service.implants.HospitalService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/auth")
class RegisterUserController @Autowired constructor(
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val passwordEncoder: PasswordEncoder,
    private val auth0Service: Auth0Service,
    private val hospitalService: HospitalService
) {

    private val logger = LoggerFactory.getLogger(RegisterUserController::class.java)

    @PostMapping("/register")
    fun registerUser(@RequestBody registerRequest: RegisterRequest): ResponseEntity<Any> {
        // Get the logged-in user's role from the local DB: TODO Fetch get actual logged in user
        val currentUser = userRepository.findByEmail(registerRequest.adminEmail)
            ?: return ResponseEntity("Admin user not found", HttpStatus.NOT_FOUND)

        if (currentUser.role.roleName != "ADMIN") {
            return ResponseEntity("Unauthorized: Only admins can register new users.", HttpStatus.UNAUTHORIZED)
        }

        // Validate if the new user already exists
        if (userRepository.findByEmail(registerRequest.userEmail) != null) {
            return ResponseEntity("User already exists.", HttpStatus.CONFLICT)
        }

        val userRole = roleRepository.findByRoleName(registerRequest.roleName) // Exception handling TODO or provide pre-defined Role values in FE.
        val hospital = hospitalService.getHospitalByName(registerRequest.hospitalName)

        // Register the new user in the local DB
        val newUser = userRole?.roleId?.let {
            User(
                null, email = registerRequest.userEmail, password =
                passwordEncoder.encode(registerRequest.password),
                registerRequest.userName, last_login = null, it, hospital?.hospitalId
            )
        }

        userRepository.save(newUser)

        // Register the new user in Auth0
        val auth0Created = auth0Service.createUserInAuth0(registerRequest.userEmail, registerRequest.password)

        return if (auth0Created) {
            logger.info("New user registered successfully.")
            ResponseEntity("User registered successfully.", HttpStatus.OK)
        } else {
            ResponseEntity("Failed to register user.", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @PostMapping("/reset-password")
    fun resetPassword(@RequestBody resetPasswordRequest: ResetPasswordRequest): ResponseEntity<String> {

        // Fetch user from the local database
        val user = userRepository.findByEmail(resetPasswordRequest.email)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found")

        // Update password in the local database
        val encodedNewPassword = passwordEncoder.encode(resetPasswordRequest.newPassword)
        user.password = encodedNewPassword
        user.last_login = LocalDateTime.now()
        userRepository.save(user)

        // Update password in Auth0
        val auth0UpdateSuccess = auth0Service.updateAuth0Password(resetPasswordRequest.email, resetPasswordRequest.newPassword)

        return if (auth0UpdateSuccess) {
            ResponseEntity.ok("Password reset successful")
        } else {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update password. Retry.")
        }
    }

    // Retaining if needed to be utilized in the future.
//    private fun generateTempPassword(length: Int = 12): String {
//        val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#\$%^&*()-_=+<>?"
//        return (1..length)
//            .map { chars.random() }
//            .joinToString("")
//    }
}

data class RegisterRequest(
    val adminEmail: String, // This will be passed in the request body to identify the logged-in admin
    val userEmail: String, // The new user's email to be registered
    val password: String, // The new user's password to be registered
    val userName: String,
    val roleName: String,
    val hospitalName: String
)

data class ResetPasswordRequest(
    val email: String,
    val newPassword: String
)

