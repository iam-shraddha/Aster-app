package com.hypermind.implantcard.service.auth

import com.hypermind.implantcard.repository.auth.UserRepository
import com.hypermind.implantcard.utils.exceptions.UserNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class UserService(private val userRepository: UserRepository) {

    fun updatePasswordAndLastLogin(email: String, newPassword: String) {
        val user = userRepository.findByEmail(email) ?: throw UserNotFoundException("User with ID $ not found")
        user.password = hashPassword(newPassword)
        user.last_login = LocalDateTime.now()
        userRepository.save(user)
    }

    private fun hashPassword(password: String): String {
        return BCryptPasswordEncoder().encode(password)
    }
}
