package com.hypermind.implantcard.model.db.implants

import com.hypermind.implantcard.model.general.Contact
import com.hypermind.implantcard.utils.convertors.ContactsConvertor
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*


@Entity
@Table(name = "hospital_info")
class HospitalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hospital_id")
    var hospitalId: Int?= null

    @Column(name = "start_date")
    var startDate : LocalDateTime ?= null

    @Column(name = "hospital_name")
    var hospitalName : String ?=  null

    @Column(name="contact_no")
    var contactNumber: String ?= null

    @Column(name="website_addr")
    var websiteAddress: String ?= null

    @Column(name="email_id")
    var emailId: String ?= null

    @Lob
    @Column(name="signature")
    var signature: String ?= null

    @Lob
    @Column(name="logo_hd")
    var logoHd: String ?= null

    @Lob
    @Column(name="logo_ft")
    var logoFt: String ?= null
}