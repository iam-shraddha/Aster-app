package com.hypermind.implantcard.repository.implants

import com.hypermind.implantcard.model.db.implants.HospitalEntity
import com.hypermind.implantcard.model.db.implants.PatientEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PdfRepository {
    fun findHospitalByHospitalId(hospitalId: String): HospitalEntity?
    fun findPatientByPatientId(patientId: String): PatientEntity?
}
