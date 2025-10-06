package com.hypermind.implantcard.repository.implants

import com.hypermind.implantcard.model.db.implants.PatientEntity
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface PatientRepository  : JpaRepository<PatientEntity, String> {

    @Query(value = "select * from patient_info where LOWER(patient_name) LIKE LOWER(:name)",nativeQuery = true)
    fun getPatientsByName(@Param("name") name:String):List<PatientEntity>?

    @Query("SELECT p FROM PatientEntity p JOIN FETCH p.hospitalEntity h WHERE h.hospitalId = :hospitalId")
    fun findAllByHospitalId(hospitalId: Int, pageable: Pageable): Page<PatientEntity>
}