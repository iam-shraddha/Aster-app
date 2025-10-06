package com.hypermind.implantcard.controller.implants

import com.hypermind.implantcard.model.dto.implants.PatientDTO
import com.hypermind.implantcard.model.implants.Patient
import com.hypermind.implantcard.service.implants.PatientService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("patients")
class PatientController(private val patientService: PatientService) {

    @PostMapping("/addNewPatients")
    fun addNewPatient(@RequestBody requestBody: PatientDTO) : ResponseEntity<Any> {
        var newPatient = patientService.addNewPatient(requestBody)
        return ResponseEntity.ok(newPatient);
    }

    @PostMapping("/updatePatient")
    fun updatePatientDetail(@RequestBody patient: Patient): Patient? {
        var patientDetail = patientService.updatePatientDetail(patient)
        return patientDetail
    }

    @GetMapping("/viewPatient/{id}")
    fun viewPatientById(@PathVariable("id") id: String): Patient? {
        var patientDetail = patientService.getPatientDetail(id);
        return patientDetail
    }

    @GetMapping("/viewPatientByName/{name}")
    fun viewPatientByname(@PathVariable("name") name: String): List<Patient>? {
        var patientDetails = patientService.getPatientsByName(name);
        return patientDetails
    }
}