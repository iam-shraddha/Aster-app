package com.hypermind.implantcard.repository.implants

import com.hypermind.implantcard.model.db.implants.DoctorEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface DoctorRepository : JpaRepository<DoctorEntity, Int> {

    @Query("SELECT d FROM DoctorEntity d WHERE d.hospitalId = :hospitalId AND d.isActive = true")
    fun findByHospitalIdAndIsActive(@Param("hospitalId") hospitalId: Int): List<DoctorEntity>

    @Query("SELECT d FROM DoctorEntity d WHERE d.doctorId = :doctorId AND d.isActive = true")
    fun findByIdAndIsActive(@Param("doctorId") doctorId: Int): DoctorEntity?

    @Query("SELECT d FROM DoctorEntity d WHERE d.isActive = true")
    fun findAllActiveDoctors(): List<DoctorEntity>
}
