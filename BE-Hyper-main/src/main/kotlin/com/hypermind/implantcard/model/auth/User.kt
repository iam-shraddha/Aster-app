package com.hypermind.implantcard.model.auth

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "Users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val user_id: Int? = 0,

    @Column(unique = true, nullable = false, length = 254)
    val email: String,

    @Column(nullable = false, length = 60)  // Hash password?
    var password: String,

    @Column(length = 254)
    val fullName: String,

    @Column(name = "last_login", nullable = true)
    var last_login: LocalDateTime? = null,

    @Column(name = "role_id", nullable = false)
    val roleId: Int,

    // Maintaining hospital_id as nullable since we as HMT being a root/admin user are without a hospital.
    @Column(name = "hospital_id", nullable = true)
    val hospitalId: Int?
) {
    // No-argument constructor for Hibernate
    constructor() : this(null, "", "", "", null, 0, null)

    @ManyToOne
    @JoinColumn(name = "role_id", insertable = false, updatable = false)
    lateinit var role: Role
}
