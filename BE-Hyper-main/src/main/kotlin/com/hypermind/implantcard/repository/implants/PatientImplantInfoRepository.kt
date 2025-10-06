package com.hypermind.implantcard.repository.implants


import PatientImplantInfoSearchKey
import com.hypermind.implantcard.model.db.implants.PatientImplantInfoEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PatientImplantInfoRepository : JpaRepository<PatientImplantInfoEntity, PatientImplantInfoSearchKey> {

//    @Query(value = "select * from patient_implant_info where patient_id = :patientId",nativeQuery = true)
//    fun getPatientByRegistrationNumber(patientId:Integer):List<PatientImplantInfoEntity>?

    fun findByPatientId(patientId : String?): List<PatientImplantInfoEntity>?

    @Query("""
    SELECT i
    FROM PatientImplantInfoEntity i
    WHERE i.patientId = :patientId AND i.isActive = true
""")
    fun findActiveByPatientId(patientId: String): List<PatientImplantInfoEntity>

}