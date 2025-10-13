package com.hypermind.implantcard.controller.implants

import com.hypermind.implantcard.model.implants.Doctor
import com.hypermind.implantcard.service.implants.DoctorService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/doctors")
class DoctorController(private val doctorService: DoctorService) {

    @GetMapping("/getAllDoctors")
    fun getAllDoctors(): ResponseEntity<List<Doctor>> {
        val doctors = doctorService.getAllDoctors()
        return ResponseEntity.ok(doctors)
    }

    @GetMapping("/byHospital/{hospitalId}")
    fun getDoctorsByHospitalId(@PathVariable("hospitalId") hospitalId: Int): ResponseEntity<List<Doctor>> {
        val doctors = doctorService.getDoctorsByHospitalId(hospitalId)
        return ResponseEntity.ok(doctors)
    }

    @GetMapping("/{doctorId}")
    fun getDoctorById(@PathVariable("doctorId") doctorId: Int): ResponseEntity<Doctor> {
        val doctor = doctorService.getDoctorById(doctorId)
        return if (doctor != null) {
            ResponseEntity.ok(doctor)
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }

    @PostMapping("/create")
    fun createDoctor(@RequestBody doctor: Doctor): ResponseEntity<Doctor> {
        return try {
            val createdDoctor = doctorService.createDoctor(doctor)
            ResponseEntity.status(HttpStatus.CREATED).body(createdDoctor)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
    }

    @PutMapping("/{doctorId}")
    fun updateDoctor(
        @PathVariable("doctorId") doctorId: Int,
        @RequestBody doctor: Doctor
    ): ResponseEntity<Doctor> {
        val updatedDoctor = doctorService.updateDoctor(doctorId, doctor)
        return if (updatedDoctor != null) {
            ResponseEntity.ok(updatedDoctor)
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }

    @DeleteMapping("/{doctorId}")
    fun deleteDoctor(@PathVariable("doctorId") doctorId: Int): ResponseEntity<String> {
        val deleted = doctorService.deleteDoctor(doctorId)
        return if (deleted) {
            ResponseEntity.ok("Doctor deleted successfully")
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found")
        }
    }
}
