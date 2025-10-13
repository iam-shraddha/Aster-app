package com.hypermind.implantcard.model.db.implants

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "doctor_info")
class DoctorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    var doctorId: Int? = null

    @Column(name = "doctor_name")
    var doctorName: String? = null

    @Column(name = "doctor_specialization")
    var doctorSpecialization: String? = null

    @Column(name = "signature_url")
    var signatureUrl: String? = null

    @Column(name = "hospital_id")
    var hospitalId: Int? = null

    @Column(name = "is_active")
    var isActive: Boolean? = true

    @Column(name = "created_date")
    var createdDate: LocalDateTime? = LocalDateTime.now()

    // Relationship with HospitalEntity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", insertable = false, updatable = false)
    var hospitalEntity: HospitalEntity? = null
}
