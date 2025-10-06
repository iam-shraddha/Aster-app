package com.hypermind.implantcard.model.implants

import java.time.LocalDateTime

class PatientImplantInfo {

    var patientId: String ?= null
    var implantId: Integer ?= null
    var implantName: String ?= null
    var operationSide: String ?= null
    var operationDate: String ?= null
    var isActive : Boolean ?= null
}