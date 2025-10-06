package com.hypermind.implantcard.service.implants

import com.hypermind.implantcard.model.db.implants.ImplantPrintHistory
import com.hypermind.implantcard.model.dto.implants.ImplantPrintHistoryDTO
import com.hypermind.implantcard.repository.implants.ImplantPrintHistoryRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class ImplantPrintHistoryService(
    private val implantPrintHistoryRepository: ImplantPrintHistoryRepository
) {

    fun savePrintHistory(implantPrintHistoryDTO: ImplantPrintHistoryDTO): ImplantPrintHistory {
        validateDto(implantPrintHistoryDTO)

        val implantPrintHistory = ImplantPrintHistory(
            hospitalId = implantPrintHistoryDTO.hospitalId!!, // Nullable to non-nullable mapping
            patientId = implantPrintHistoryDTO.patientId!!,
            printDate = implantPrintHistoryDTO.printDate ?: LocalDateTime.now() // Use default if not provided
        )
        return implantPrintHistoryRepository.save(implantPrintHistory)
    }

    fun getPrintHistoryByHospitalId(hospitalId: Int): List<ImplantPrintHistory> {
        return implantPrintHistoryRepository.findByHospitalId(hospitalId)
    }

    private fun validateDto(dto: ImplantPrintHistoryDTO) {
        requireNotNull(dto.hospitalId) { "Hospital ID must not be null" }
        requireNotNull(dto.patientId) { "Patient ID must not be null" }
    }
}
