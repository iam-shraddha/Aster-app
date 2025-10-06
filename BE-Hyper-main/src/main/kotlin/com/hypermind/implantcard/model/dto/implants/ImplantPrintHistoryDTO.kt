package com.hypermind.implantcard.model.dto.implants

import java.time.LocalDateTime

data class ImplantPrintHistoryDTO(
    var hospitalId: Int,
    var patientId: String,
    var printDate: LocalDateTime
)
