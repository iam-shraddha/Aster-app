package com.hypermind.implantcard.controller.implants

import com.hypermind.implantcard.model.dto.implants.HospitalDTO
import com.hypermind.implantcard.model.dto.implants.PatientDTO
import com.hypermind.implantcard.model.implants.Hospital
import com.hypermind.implantcard.service.implants.HospitalService
import org.springframework.http.MediaType.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("hospitals")
class HospitalController(private val hospitalService: HospitalService) {

//    @RequestParam("file") MultipartFile file,
//    @RequestParam("videoPayload") String videoPayload,

//    @PostMapping("/addNewHospital", consumes = [MULTIPART_FORM_DATA_VALUE,APPLICATION_JSON_VALUE])
//    fun addNewHospital(@RequestBody requestBody: HospitalDTO
////                       @RequestParam("signature") signature : MultipartFile
//    ) : ResponseEntity<Any> {

    @PostMapping("/addNewHospital")
    fun addNewHospital(@RequestBody requestBody: HospitalDTO): ResponseEntity<Any> {
        var newHospital = hospitalService.addNewHospital(requestBody)
        return ResponseEntity.ok(newHospital);
    }

    @PostMapping("/updateHospital")
    fun updateHospital(@RequestBody requestBody: Hospital): ResponseEntity<Any> {

        var updatedHospitalDetail = hospitalService.updateHospitalDetail(requestBody)
        return ResponseEntity.ok(updatedHospitalDetail)
    }

    @GetMapping(value = ["/viewHospital/{id}"])
    fun viewHospital(@PathVariable("id") id: Int): ResponseEntity<Any> {

        var hospital = hospitalService.getHospital(id)
        return ResponseEntity.ok(hospital)
    }

    @GetMapping("/getHospitals")
    fun getAllHospitals(): ResponseEntity<List<Hospital>> {
        val hospitals = hospitalService.getAllHospitals()
        return ResponseEntity.ok(hospitals)
    }
}