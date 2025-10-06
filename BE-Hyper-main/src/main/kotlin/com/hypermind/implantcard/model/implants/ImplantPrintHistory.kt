package com.hypermind.implantcard.model.implants

import java.time.LocalDateTime

class ImplantPrintHistory {

    val hospitalId: Integer ?= null
    val patientId: String ?= null
    val printDate: LocalDateTime = LocalDateTime.now()


}