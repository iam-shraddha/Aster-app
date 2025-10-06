package com.hypermind.implantcard.controller.implants

import com.hypermind.implantcard.model.db.implants.ImplantPrintHistory
import com.hypermind.implantcard.model.dto.implants.ImplantPrintHistoryDTO
import com.hypermind.implantcard.service.implants.ImplantPrintHistoryService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/implant-print-history")
class ImplantPrintHistoryController(
    private val service: ImplantPrintHistoryService
) {

    @PostMapping("/add")
    fun addPrintHistory(@RequestBody dto: ImplantPrintHistoryDTO): ResponseEntity<String> {
        service.savePrintHistory(dto)
        return ResponseEntity("Record added successfully to implant_print_history", HttpStatus.CREATED)
    }

    @GetMapping("/by-hospital/{hospitalId}")
    fun getPrintHistoryByHospitalId(@PathVariable hospitalId: Int): ResponseEntity<List<ImplantPrintHistory>> {
        val printHistory = service.getPrintHistoryByHospitalId(hospitalId)
        return if (printHistory.isNotEmpty()) {
            ResponseEntity.ok(printHistory)
        } else {
            ResponseEntity.noContent().build()
        }
    }
}