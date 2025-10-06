package com.hypermind.implantcard.model.dto.implants

import com.hypermind.implantcard.model.enum.Gender
import com.hypermind.implantcard.model.general.Contact
import java.time.LocalDate
import java.util.*
import kotlin.properties.Delegates

class PatientDTO {

    var patientId: String? = null
    var patientName: String ?= null
    var gender: Gender? = Gender.M
    var age: Integer? = null
    var hospitalId: Int? = null
}