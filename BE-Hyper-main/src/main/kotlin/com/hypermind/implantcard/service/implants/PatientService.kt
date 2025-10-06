package com.hypermind.implantcard.service.implants


import com.hypermind.implantcard.model.db.implants.PatientEntity
import com.hypermind.implantcard.model.dto.implants.PatientDTO
import com.hypermind.implantcard.model.implants.Patient
import com.hypermind.implantcard.repository.implants.HospitalRepository
import com.hypermind.implantcard.repository.implants.PatientRepository
import org.springframework.stereotype.Service
import java.util.Random
import java.util.stream.Collectors
import kotlin.jvm.optionals.getOrNull

@Service
class PatientService(private val patientRepository: PatientRepository,
                     private val hospitalRepository: HospitalRepository) {

    private val random = Random()
    fun addNewPatient(patientDTO : PatientDTO): Patient? {

        var patient = patientDTOtoPatient(patientDTO)
        validatePatientInfo(patient)
        var patientEntity = patientToPatientEntity(patient)
        var hospitalById = hospitalRepository.findById((patient.hospitalId ?: 0).toInt())
        if (null == hospitalById) {
            return null
        }
        patientEntity.hospitalEntity = hospitalById.get()
        var savedPatient = patientRepository.save(patientEntity)
        return patientEntityToPatient(savedPatient)
    }

    fun getPatientDetail(id : String) : Patient? {
        var patientEntityDetails = patientRepository.findById(id)

        var orNull = patientEntityDetails.getOrNull()
        if (null == orNull)
            return null;
        var toPatient = patientEntityToPatient(patientEntityDetails.get())
        return toPatient;
    }

    fun updatePatientDetail(patient: Patient): Patient? {

        var existsById = patientRepository.existsById(patient.patientId)
        if (!existsById)
            return null

        var patientEntity = patientToPatientEntity(patient)
        patientEntity.patientId = patient.patientId

        var hospitalId = patient.hospitalId

        var hospitalById = hospitalRepository.findById((patient.hospitalId ?: 0).toInt())
        if (null == hospitalById) {
            return null
        }
        patientEntity.hospitalEntity = hospitalById.get()

        var updatedPatientEntity = patientRepository.save(patientEntity)
        var updatedPatient = patientEntityToPatient(updatedPatientEntity)
        return updatedPatient
    }

    fun getPatientsByName(name : String) : List<Patient>? {

        var searchPattern = "%${name}%"
        var patientEntityDetails = patientRepository.getPatientsByName(searchPattern)

        if (null == patientEntityDetails)
            return null;

        var patientList = patientEntityDetails.stream().map { t -> patientEntityToPatient(t) }
            .collect(Collectors.toList())

        return patientList;
    }


    private fun validatePatientInfo(patient : Patient): Boolean {
        return true
    }

    private fun patientToPatientEntity(patient: Patient) : PatientEntity{
        var newPatientEntity = PatientEntity();
        if (patient.patientId != null)
            newPatientEntity.patientId = patient.patientId
        newPatientEntity.patientName = patient.patientName
        newPatientEntity.gender = patient.gender
        newPatientEntity.age = patient.age

        return newPatientEntity
    }

    private fun patientEntityToPatient(patientEntity: PatientEntity) : Patient {

        var patient = Patient()
        patient.patientId = patientEntity.patientId
        patient.patientName = patientEntity.patientName
        patient.gender = patientEntity.gender
        patient.age = patientEntity.age
        var hospitalEntity = patientEntity.hospitalEntity
        if (hospitalEntity != null) {
            patient.hospitalId = hospitalEntity.hospitalId
        }
        return patient
    }


    private fun patientDTOtoPatient(patientDTO: PatientDTO): Patient {

        var patient = Patient()
        patient.patientId = patientDTO.patientId
        patient.patientName = patientDTO.patientName
        patient.gender = patientDTO.gender
        patient.age = patientDTO.age
        patient.hospitalId = patientDTO.hospitalId
        return patient
    }
}