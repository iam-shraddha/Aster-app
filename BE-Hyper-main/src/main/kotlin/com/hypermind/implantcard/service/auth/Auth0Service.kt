package com.hypermind.implantcard.service.auth

import com.fasterxml.jackson.annotation.JsonProperty
import com.hypermind.implantcard.model.auth.User
import com.hypermind.implantcard.repository.auth.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.*
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate


@Service
class Auth0Service(
    private val restTemplate: RestTemplate,
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    private val logger = LoggerFactory.getLogger(Auth0Service::class.java)

    @Value("\${auth0.domain}")
    private lateinit var auth0Domain: String

    @Value("\${auth0.clientId}")
    private lateinit var clientId: String

    @Value("\${auth0.clientSecret}")
    private lateinit var clientSecret: String

    @Value("\${auth0.audience}")
    private lateinit var audience: String

    fun getAuth0Token(email: String, password: String): Auth0LoginResponse? {

        val restTemplate = RestTemplate()
        val url = "https://$auth0Domain/oauth/token"

        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON

        val requestBody = mapOf(
            "grant_type" to "password",
            "username" to email,
            "password" to password,
            "audience" to audience,
            "client_id" to clientId,
            "client_secret" to clientSecret,
            "scope" to "openid profile email",
            "connection" to "Username-Password-Authentication"
        )

        val request = HttpEntity(requestBody, headers)

        return try {
            if (createUserInAuth0(email, password)){
                val response = restTemplate.postForEntity(url, request, Auth0LoginResponse::class.java)
                logger.info("Auth0 Response: {}", response.body)
                if (response.statusCode == HttpStatus.OK) {
                    response.body
                } else null
            } else null
        } catch (e: Exception) {
            logger.error("Error during Auth0 token request", e)
            return null
        }
    }

    fun createUserInAuth0(email: String, password: String): Boolean {
        val restTemplate = RestTemplate()
        val auth0Domain = "https://$auth0Domain"
        val managementApiToken: String? = getManagementApiToken() // Fetch Auth0 Management API token
        val url = "$auth0Domain/api/v2/users"
        val headers = HttpHeaders()
        headers["Authorization"] = "Bearer $managementApiToken"
        headers.contentType = MediaType.APPLICATION_JSON
        val userDetails: MutableMap<String, Any> = HashMap()
        userDetails["email"] = email
        userDetails["password"] = password
        userDetails["connection"] = "Username-Password-Authentication"
        userDetails["email_verified"] = true
        val request: HttpEntity<Map<String, Any>> = HttpEntity(userDetails, headers)

        return try {
            // Attempt to create the user in Auth0
            restTemplate.exchange(url, HttpMethod.POST, request, Map::class.java)
            logger.info("User registered successfully in Auth0.")
            true // Success
        } catch (e: HttpClientErrorException) {
            if (e.statusCode == HttpStatus.CONFLICT) {
                // User already exists in Auth0, continue with token generation
                logger.info("User already exists in Auth0, continuing with token generation.")
                true // User already exists, proceed
            } else {
                // Other errors
                e.printStackTrace()
                false // Failed to register user
            }
        }
    }

    // Method to update Auth0 password for a new user.
    fun updateAuth0Password(email: String, newPassword: String): Boolean {
        val restTemplate = RestTemplate(HttpComponentsClientHttpRequestFactory())
        val managementApiToken = getManagementApiToken()

        val userId = managementApiToken?.let { getUserIdByEmail(email, it) }
        val url = "https://$auth0Domain/api/v2/users/$userId"

        // Set headers
        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_JSON
            setBearerAuth(managementApiToken)
        }

        // Define body as a map
        val body = mapOf(
            "password" to newPassword,
            "connection" to "Username-Password-Authentication"
        )

        val requestEntity = HttpEntity(body, headers)

        return try {
            val response = restTemplate.exchange(url, HttpMethod.PATCH, requestEntity, String::class.java)
            println("Password update response: ${response.body}")
            response.statusCode == HttpStatus.OK || response.statusCode == HttpStatus.NO_CONTENT
        } catch (ex: Exception) {
            println("Error during password update: ${ex.message}")
            false
        }
    }

    fun getUserIdByEmail(email: String, authToken: String): String? {
        val restTemplate = RestTemplate()

        // Define the URL with email search query
        val url = "https://$auth0Domain/api/v2/users-by-email?email=$email"

        // Set headers for authorization
        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_JSON
            setBearerAuth(authToken)
        }

        val requestEntity = HttpEntity<Void>(headers)

        try {
            val response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, Array<Auth0User>::class.java)
            val users = response.body
            return users?.firstOrNull()?.userId
        } catch (ex: Exception) {
            println("Error fetching user ID: ${ex.message}")
            return null
        }
    }

    // Retaining for any future usage. Unused for current user registration workflow.
    fun sendPasswordResetEmail(email: String): Boolean {

        val managementApiToken = getManagementApiToken()

        // Auth0 Password Reset URL
        val url = "https://$auth0Domain/api/v2/tickets/password-change"

        val headers = HttpHeaders()
        headers["Authorization"] = "Bearer $managementApiToken"
        headers.contentType = MediaType.APPLICATION_JSON

        val requestBody = mapOf(
            "email" to email,
            "connection_id" to "con_XxcujiZkAtngK9IH"
        )

        val request = HttpEntity(requestBody, headers)

        return try {
            val response = restTemplate.exchange(url, HttpMethod.POST, request, Map::class.java)
            response.statusCode == HttpStatus.OK
        } catch (e: Exception) {
            logger.error("Error sending password reset email via Auth0: ${e.message}")
            false
        }
    }

    fun getManagementApiToken(): String? {
        // Token endpoint URL
        val url = "https://$auth0Domain/oauth/token";

        val requestBody = mapOf(
            "client_id" to clientId,
            "client_secret" to clientSecret,
            "audience" to "https://dev-bi25-v79.us.auth0.com/api/v2/",
            "grant_type" to "client_credentials"
        )

        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON

        val entity = HttpEntity(requestBody, headers)

        val restTemplate = RestTemplate()

        val response = restTemplate.exchange(url, HttpMethod.POST, entity, Map::class.java).body

        return response?.get("access_token") as String?
    }
}

data class Auth0LoginResponse(
    val access_token: String,
    val id_token: String,
    val token_type: String,
    val expires_in: Long
)

data class Auth0User(
    @JsonProperty("user_id")
    val userId: String?
    )
