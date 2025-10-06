package com.hypermind.implantcard.model.implants

import com.hypermind.implantcard.model.enum.Gender
import com.hypermind.implantcard.model.general.Contact
import java.io.Serializable
import java.time.LocalDate
import java.util.*


class Patient {

    var patientId: String ?= null
    var patientName: String ?= null
    var gender: Gender? = Gender.M
    var age: Integer? = null
    var hospitalId: Int?= null
}