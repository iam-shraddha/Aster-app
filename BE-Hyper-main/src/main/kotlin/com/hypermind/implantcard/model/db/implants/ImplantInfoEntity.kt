package com.hypermind.implantcard.model.db.implants

import jakarta.persistence.*

@Entity
@Table(name = "implant_info")
class ImplantInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "implant_id")
    var implantId: Integer ?= null

    @Column(name = "implant_name")
    var implantName : String ?= null

    @Column(name = "company_name")
    var companyName : String ?= null
}