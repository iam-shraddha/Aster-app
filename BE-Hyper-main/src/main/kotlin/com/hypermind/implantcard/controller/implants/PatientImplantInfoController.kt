package com.hypermind.implantcard.controller.implants

//import com.hypermind.implantcard.model.dto.implants.PdfDto
import PatientImplantInfoSearchKey
import com.hypermind.implantcard.model.dto.implants.PatientImplantInfoDTO
import com.hypermind.implantcard.model.dto.implants.PatientWithTheirImplantDTO
import com.hypermind.implantcard.model.implants.PatientImplantInfo
import com.hypermind.implantcard.model.implants.PatientWithTheirImplants
import com.hypermind.implantcard.service.implants.HospitalService
import com.hypermind.implantcard.service.implants.PatientImplantInfoService
import com.hypermind.implantcard.service.implants.PatientService
import com.hypermind.implantcard.service.implants.PdfService
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.io.ByteArrayOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

@RestController
@RequestMapping("patientImplantInfo")
class PatientImplantInfoController(private val patientImplantInfoService: PatientImplantInfoService,
                                   private val patientService: PatientService,
                                   private val pdfService: PdfService,
                                   private val hospitalService: HospitalService) {

    @PostMapping("/addNewPatientImplantInfo")
    fun addNewPatientImplantInfo(@RequestBody patientImplantInfoDTO: PatientImplantInfoDTO) : ResponseEntity<Any> {

        var newPatientImplantInfo = patientImplantInfoService.addNewPatientImplantInfo(patientImplantInfoDTO)
        return ResponseEntity.ok(newPatientImplantInfo)
    }

    @PostMapping("/getPatientImplantInfo")
    fun getPatientImplantInfo(@RequestBody patientImplantInfoSearchKey: PatientImplantInfoSearchKey):ResponseEntity<Any> {

        var patientImplantInfoDetail = patientImplantInfoService.getPatientImplantInfoBySearchKey(patientImplantInfoSearchKey)
        return ResponseEntity.ok().body(patientImplantInfoDetail)
    }

    @GetMapping("/getByPatientId/{patientId}")
    fun getInfoByPatientId(@PathVariable("patientId") id : String): ResponseEntity<Any> {

        var implantInfoByPatientIdList = patientImplantInfoService.getDetailsByPatientId(id)
        return ResponseEntity.ok().body(implantInfoByPatientIdList)
    }

    @GetMapping("/getDetailsWithPatientByPatientId/{patientId}")
    fun getDetailsWithPatientByPatientId(@PathVariable("patientId") id : String): ResponseEntity<Any> {

        var implantInfoByPatientIdList = patientImplantInfoService.getDetailsByPatientId(id)
        var patientDetail = patientService.getPatientDetail(id)

        var patientWithTheirImplants = PatientWithTheirImplants()
        patientWithTheirImplants.patient = patientDetail
        patientWithTheirImplants.patientImplantInfoList = implantInfoByPatientIdList

        return ResponseEntity.ok().body(patientWithTheirImplants)
    }

    @PostMapping("/updatePatientImplantInfoForPatient")
    fun updatePatientImplantInfo(@RequestBody patientImplantInfo: PatientImplantInfo):ResponseEntity<Any> {
        val updatedPatientImplantInfo = patientImplantInfoService.updatePatientImplantInfoDetail(patientImplantInfo)
        return ResponseEntity.ok(updatedPatientImplantInfo)
    }

    @PostMapping("/savePatientImplantInfoForPatient")
    fun savePatientImplantInfo(@RequestBody patientImplantInfoList: List<PatientImplantInfo>) : ResponseEntity<Any> {

        var savedPatientImplantInfo = patientImplantInfoService.savePatientImplantInfo(patientImplantInfoList)
        return ResponseEntity.ok(savedPatientImplantInfo)
    }



    // Generate combined PDF for patient and hospital details
    @GetMapping("/generatePdf/{patientId}/{hospitalId}")
    fun generateCombinedPdf(
        @PathVariable("patientId") patientId: String,
        @PathVariable("hospitalId") hospitalId: Int
    ): ResponseEntity<Any> {
        try {
            // Fetch patient details and implant info
            val implantInfoByPatientIdList = patientImplantInfoService.getDetailsByPatientId(patientId)
            val patientDetail = patientService.getPatientDetail(patientId)
                ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not found for ID: $patientId")

            val patientWithTheirImplants = PatientWithTheirImplants().apply {
                this.patient = patientDetail
                this.patientImplantInfoList = implantInfoByPatientIdList
            }

            // Fetch hospital details
            val hospital = hospitalService.getHospital(hospitalId)
                ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hospital not found for ID: $hospitalId")

            // Generate JPEG (previously PDF)
            val jpegBytes = pdfService.generatePdf(patientWithTheirImplants, hospital)

            // Set appropriate headers for JPEG download
            val headers = HttpHeaders().apply {
                contentType = MediaType.IMAGE_JPEG
                setContentDispositionFormData("attachment", "patient_hospital_card_${patientId}_$hospitalId.jpeg")
            }

            return ResponseEntity(jpegBytes, headers, HttpStatus.OK)
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to generate image: ${e.message}")
        }
    }

    @GetMapping("/generateImages/{patientId}/{hospitalId}")
    fun generateImages(
        @PathVariable("patientId") patientId: String,
        @PathVariable("hospitalId") hospitalId: Int
    ): ResponseEntity<List<ByteArray>> {
        return try {
            // Fetch patient details and implant info
            val implantInfoByPatientIdList = patientImplantInfoService.getDetailsByPatientId(patientId)
            val patientDetail = patientService.getPatientDetail(patientId)
                ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)

            val patientWithTheirImplants = PatientWithTheirImplants().apply {
                this.patient = patientDetail
                this.patientImplantInfoList = implantInfoByPatientIdList
            }

            // Fetch hospital details
            val hospital = hospitalService.getHospital(hospitalId)
                ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)

            // Generate images
            val imagesBytes = pdfService.generateImage(patientWithTheirImplants, hospital)

            // Return images as binary data
            ResponseEntity.ok(imagesBytes)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }


    @GetMapping("/generateImage1/{patientId}/{hospitalId}")
    fun generateImage1(
        @PathVariable("patientId") patientId: String,
        @PathVariable("hospitalId") hospitalId: Int
    ): ResponseEntity<ByteArray> {
        return try {
            val imageBytes = generateImagesHelper(patientId, hospitalId)[0] // First image
            ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(imageBytes)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }

    @GetMapping("/generateImage2/{patientId}/{hospitalId}")
    fun generateImage2(
        @PathVariable("patientId") patientId: String,
        @PathVariable("hospitalId") hospitalId: Int
    ): ResponseEntity<ByteArray> {
        return try {
            val imageBytes = generateImagesHelper(patientId, hospitalId)[1] // Second image
            ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(imageBytes)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }

    // Helper function for reusability
    fun generateImagesHelper(patientId: String, hospitalId: Int): List<ByteArray> {
        val implantInfoByPatientIdList = patientImplantInfoService.getDetailsByPatientId(patientId)
        val patientDetail = patientService.getPatientDetail(patientId)
            ?: throw IllegalArgumentException("Patient not found for ID: $patientId")

        val patientWithTheirImplants = PatientWithTheirImplants().apply {
            this.patient = patientDetail
            this.patientImplantInfoList = implantInfoByPatientIdList
        }

        val hospital = hospitalService.getHospital(hospitalId)
            ?: throw IllegalArgumentException("Hospital not found for ID: $hospitalId")

        return pdfService.generateImage(patientWithTheirImplants, hospital)
    }




    // New endpoint to convert PDF to JPEG
//    @GetMapping("/convertPdfToJpeg/{patientId}/{hospitalId}/pages", produces = [MediaType.IMAGE_JPEG_VALUE])
//    fun getPdfPages(
//        @PathVariable("patientId") patientId: String,
//        @PathVariable("hospitalId") hospitalId: Int
//    ): ResponseEntity<List<ByteArray>> {
//        try {
//            val implantInfoByPatientIdList = patientImplantInfoService.getDetailsByPatientId(patientId)
//            val patientDetail = patientService.getPatientDetail(patientId)
//                ?: return ResponseEntity.notFound().build()
//
//            val patientWithTheirImplants = PatientWithTheirImplants().apply {
//                this.patient = patientDetail
//                this.patientImplantInfoList = implantInfoByPatientIdList
//            }
//
//            val hospital = hospitalService.getHospital(hospitalId)
//                ?: return ResponseEntity.notFound().build()
//
//            val pdfBytes = pdfService.generatePdf(patientWithTheirImplants, hospital)
//            val pages = pdfService.convertPdfToJpegPages(pdfBytes)
//
//            val headers = HttpHeaders().apply {
//                contentType = MediaType.APPLICATION_JSON
//            }
//
//            return ResponseEntity(pages, headers, HttpStatus.OK)
//        } catch (e: Exception) {
//            return ResponseEntity.internalServerError().build()
//        }
//    }
//====================================================================

//    @GetMapping("/generateCombinedCardsPdf/{patientId}/{hospitalId}")
//    fun generateCombinedCardsPdf(
//        @PathVariable("patientId") patientId: String,
//        @PathVariable("hospitalId") hospitalId: Int
//    ): ResponseEntity<Any> {
//        try {
//            // Fetch patient details and implant info
//            val implantInfoByPatientIdList = patientImplantInfoService.getDetailsByPatientId(patientId)
//            val patientDetail = patientService.getPatientDetail(patientId)
//                ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not found for ID: $patientId")
//
//            val patientWithTheirImplants = PatientWithTheirImplants().apply {
//                this.patient = patientDetail
//                this.patientImplantInfoList = implantInfoByPatientIdList
//            }
//
//            // Fetch hospital details
//            val hospital = hospitalService.getHospital(hospitalId)
//                ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hospital not found for ID: $hospitalId")
//
//            // Generate combined PDF
//            val pdfBytes = pdfService.generateCombinedCardsPdf(patientWithTheirImplants, hospital)
//
//            // Return PDF as ResponseEntity with proper headers for file download
//            val headers = HttpHeaders().apply {
//                contentType = MediaType.APPLICATION_PDF
//                setContentDispositionFormData("attachment", "combined_patient_cards_${patientId}_$hospitalId.pdf")
//            }
//
//            return ResponseEntity(pdfBytes, headers, HttpStatus.OK)
//        } catch (e: Exception) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body("Failed to generate PDF: ${e.message}")
//        }
//    }




    @GetMapping("/getPatientsByHospital/{hospitalId}")
    fun getPatientsByHospital(
        @PathVariable hospitalId: Int,
        pageable: Pageable
    ): ResponseEntity<Page<PatientWithTheirImplantDTO>> {
        val paginatedPatients = patientImplantInfoService.getPatientsByHospitalId(hospitalId, pageable)
        return ResponseEntity.ok(paginatedPatients)
    }



}