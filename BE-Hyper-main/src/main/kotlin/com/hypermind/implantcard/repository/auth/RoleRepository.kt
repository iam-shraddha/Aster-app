package com.hypermind.implantcard.repository.auth

import com.hypermind.implantcard.model.auth.Role
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RoleRepository : JpaRepository<Role, Long> {

    fun findByRoleName(roleName: String): Role
}
