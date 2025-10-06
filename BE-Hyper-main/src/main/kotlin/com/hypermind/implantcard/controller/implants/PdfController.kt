package com.hypermind.implantcard.controller.implants

import com.hypermind.implantcard.model.dto.implants.PdfDto
import com.hypermind.implantcard.service.implants.PdfService
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("pdf")
class PdfController(private val pdfService: PdfService) {

    /*
    @PostMapping("/generate")
    fun generatePdf(@RequestBody pdfDto: PdfDto): ResponseEntity<ByteArray> {
        return try {
         //   val pdfData = pdfService.generatePdf(pdfDto)

            // Set response headers for PDF download
            val headers = HttpHeaders()
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=patient_card_${pdfDto.hospitalId}_${pdfDto.patientId}.pdf")
            headers.add(HttpHeaders.CONTENT_TYPE, "application/pdf")

            // Return the PDF byte data as a response
            ResponseEntity(pdfData, headers, HttpStatus.OK)
        } catch (e: Exception) {
            // Return an error response if PDF generation fails
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error generating PDF: ${e.message}".toByteArray())
        }
    }
    */
}
