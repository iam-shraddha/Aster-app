package com.hypermind.implantcard.model.db.implants

import com.hypermind.implantcard.model.enum.Gender
import com.hypermind.implantcard.model.general.Contact
import com.hypermind.implantcard.utils.convertors.ContactsConvertor
//import com.hypermind.implantcard.utils.convertors.PatientImplantInfoConvertor
import jakarta.persistence.*
import java.time.LocalDate
import java.util.*
import kotlin.random.Random

@Entity
@Table(name = "patient_info")
class PatientEntity {

    @Id
    @Column(name = "patient_id")
    var patientId: String ?= null

    @Column(name = "patient_name")
    var patientName: String? = null

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    var gender: Gender? = Gender.M

    @Column(name= "age")
    var age: Integer ?= null

    @ManyToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "hospital_id")
    var hospitalEntity : HospitalEntity ?= null


    /*
    @PrePersist
    fun generateId() {
        if (patientId == null) {
            patientId = generateRandomString(10);
        }
    }

    fun generateRandomString(length: Int): String {
        val digits = "0123456789"
        return buildString {
            repeat(length) {
                append(digits[Random.nextInt(digits.length)])
            }
        }
    }*/
}
