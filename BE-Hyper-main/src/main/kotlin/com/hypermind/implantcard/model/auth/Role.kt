package com.hypermind.implantcard.model.auth

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "Role")
data class Role(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val roleId: Int? = 0,

    @Column(nullable = false, unique = true)
    val roleName: String
) {
    // No-argument constructor for Hibernate
    constructor() : this(null, "")
}

