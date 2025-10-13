package com.hypermind.implantcard.service.implants

import com.hypermind.implantcard.model.db.implants.DoctorEntity
import com.hypermind.implantcard.model.implants.Doctor
import com.hypermind.implantcard.repository.implants.DoctorRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.stream.Collectors

@Service
class DoctorService(private val doctorRepository: DoctorRepository) {

    fun getAllDoctors(): List<Doctor> {
        val allDoctors = doctorRepository.findAllActiveDoctors()
        return allDoctors.stream()
            .map { doctorEntityToDoctor(it) }
            .collect(Collectors.toList())
    }

    fun getDoctorsByHospitalId(hospitalId: Int): List<Doctor> {
        val doctorsByHospital = doctorRepository.findByHospitalIdAndIsActive(hospitalId)
        return doctorsByHospital.stream()
            .map { doctorEntityToDoctor(it) }
            .collect(Collectors.toList())
    }

    fun getDoctorById(doctorId: Int): Doctor? {
        val doctorEntity = doctorRepository.findByIdAndIsActive(doctorId)
        return doctorEntity?.let { doctorEntityToDoctor(it) }
    }

    fun createDoctor(doctor: Doctor): Doctor {
        val doctorEntity = doctorToDoctorEntity(doctor)
        val savedEntity = doctorRepository.save(doctorEntity)
        return doctorEntityToDoctor(savedEntity)
    }

    fun updateDoctor(doctorId: Int, doctor: Doctor): Doctor? {
        val existingEntity = doctorRepository.findByIdAndIsActive(doctorId)
        return if (existingEntity != null) {
            existingEntity.doctorName = doctor.doctorName
            existingEntity.doctorSpecialization = doctor.doctorSpecialization
            existingEntity.signatureUrl = doctor.signatureUrl
            existingEntity.hospitalId = doctor.hospitalId
            existingEntity.isActive = doctor.isActive ?: true
            
            val updatedEntity = doctorRepository.save(existingEntity)
            doctorEntityToDoctor(updatedEntity)
        } else {
            null
        }
    }

    fun deleteDoctor(doctorId: Int): Boolean {
        val existingEntity = doctorRepository.findByIdAndIsActive(doctorId)
        return if (existingEntity != null) {
            existingEntity.isActive = false
            doctorRepository.save(existingEntity)
            true
        } else {
            false
        }
    }

    private fun doctorEntityToDoctor(doctorEntity: DoctorEntity): Doctor {
        val doctor = Doctor()
        doctor.doctorId = doctorEntity.doctorId
        doctor.doctorName = doctorEntity.doctorName
        doctor.doctorSpecialization = doctorEntity.doctorSpecialization
        doctor.signatureUrl = doctorEntity.signatureUrl
        doctor.hospitalId = doctorEntity.hospitalId
        doctor.isActive = doctorEntity.isActive
        doctor.createdDate = doctorEntity.createdDate?.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        return doctor
    }

    private fun doctorToDoctorEntity(doctor: Doctor): DoctorEntity {
        val doctorEntity = DoctorEntity()
        doctorEntity.doctorName = doctor.doctorName
        doctorEntity.doctorSpecialization = doctor.doctorSpecialization
        doctorEntity.signatureUrl = doctor.signatureUrl
        doctorEntity.hospitalId = doctor.hospitalId
        doctorEntity.isActive = doctor.isActive ?: true
        doctorEntity.createdDate = LocalDateTime.now()
        return doctorEntity
    }
}
