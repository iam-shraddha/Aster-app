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

    // Test endpoint to create/update hospital with S3 URLs for premium testing
    // Generic hospital data for testing - not specific to any hospital
    @PostMapping("/setupTestHospitalWithS3")
    fun setupTestHospitalWithS3(): ResponseEntity<Any> {
        val hospitalDTO = HospitalDTO().apply {
            hospitalName = "GENERAL HOSPITAL"  // Generic name
            contactNumber = "1234567890"  // Generic contact
            websiteAddress = "www.hospital.com"
            emailId = "info@hospital.com"
            // S3 URLs for premium assets - these will be fetched from S3
            logoHd = "https://hospital-info-s3-mumbai-apse.s3.ap-south-1.amazonaws.com/astar-aadhar-hospital/aster_logo_hd.jpg"
            logoFt = "https://hospital-info-s3-mumbai-apse.s3.ap-south-1.amazonaws.com/astar-aadhar-hospital/aster_aadhar_logo_ft1+(1).png"
            signature = "https://hospital-info-s3-mumbai-apse.s3.ap-south-1.amazonaws.com/H2/H2-+Sig.jpg"
        }
        
        val newHospital = hospitalService.addNewHospital(hospitalDTO)
        return ResponseEntity.ok(newHospital)
    }
}
