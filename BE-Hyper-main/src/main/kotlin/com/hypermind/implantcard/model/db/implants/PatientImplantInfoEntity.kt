package com.hypermind.implantcard.model.db.implants

import PatientImplantInfoSearchKey
import jakarta.persistence.*

@Entity
@Table(name = "patient_implant_info")
@IdClass(value = PatientImplantInfoSearchKey::class)
/**
Hibernate requires a public no-argument constructor for the @IdClass and all entity classes, so it can instantiate them using reflection.
Solution: Ensure that your PatientImplantInfoId class has a public no-arg constructor.
 **/
class PatientImplantInfoEntity {

    @Id
    @Column(name = "patient_id")
    var patientId : String ?= null

    @Id
    @Column(name = "implant_id")
    var implantId : Integer ?=  null

    @Id
    @Column(name = "operation_date")
    var operationDate : String ?= null

    @Column(name = "implant_name")
    var implantName : String ?=  null

    @Column(name = "operation_side")
    var operationSide: String ?= null

    @Column(name = "is_active")
    var isActive: Boolean ?= null
}
