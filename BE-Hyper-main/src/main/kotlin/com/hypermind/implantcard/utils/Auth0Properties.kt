package com.hypermind.implantcard.utils

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties
class Auth0Properties {

    @Value("\${auth0.audience}")
    lateinit var audience: String
    @Value("\${auth0.domain}")
    lateinit var domain: String
    @Value("\${auth0.clientId}")
    lateinit var clientId: String
    @Value("\${auth0.clientSecret}")
    lateinit var clientSecret: String
}
