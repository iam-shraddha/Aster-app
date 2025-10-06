package com.hypermind.implantcard.repository.implants

import com.hypermind.implantcard.model.db.implants.HospitalEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface HospitalRepository : JpaRepository<HospitalEntity, Int> {

    fun findByHospitalName(name: String): HospitalEntity?
}