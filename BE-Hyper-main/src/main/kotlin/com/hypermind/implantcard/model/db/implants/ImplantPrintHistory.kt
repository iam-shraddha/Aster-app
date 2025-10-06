package com.hypermind.implantcard.model.db.implants

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "implant_print_history")
data class ImplantPrintHistory(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0, // Default value for the primary key

    @Column(name = "hospital_id", nullable = false)
    var hospitalId: Int = 0, // Default value for hospitalId

    @Column(name = "patient_id", nullable = false)
    var patientId: String = "", // Default value for patientId

    @Column(name = "print_date", nullable = false)
    var printDate: LocalDateTime = LocalDateTime.now() // Default value for printDate
)
