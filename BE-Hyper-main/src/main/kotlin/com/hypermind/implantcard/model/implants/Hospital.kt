package com.hypermind.implantcard.model.implants

import com.hypermind.implantcard.model.general.Contact
import com.hypermind.implantcard.utils.convertors.ContactsConvertor
import jakarta.persistence.Column
import jakarta.persistence.Convert
import jakarta.persistence.Lob
import java.time.LocalDateTime

class Hospital {

    var hospitalId: Int?= null
    var startDate : LocalDateTime ?= null
    var hospitalName : String ?= null
    var contactNumber: String ?= null
    var websiteAddress: String ?= null
    var emailId: String ?= null
    var signature: String ?= null
    var logoHd: String ?= null
    var logoFt: String ?= null

}