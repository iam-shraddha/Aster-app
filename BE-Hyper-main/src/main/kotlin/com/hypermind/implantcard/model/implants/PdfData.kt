package com.hypermind.implantcard.model.implants



import com.hypermind.implantcard.model.enum.Gender
import java.time.LocalDate

data class PdfData(
    var hospitalId: Int?= null,
    var hospitalName : String ?= null,
    var contactNumber: String ?= null,
    var websiteAddress: String ?= null,
    var patientId: String ?= null,
    var patientName: String ?= null,
    var gender: Gender? = Gender.M,
    var age: Integer? = null
)
