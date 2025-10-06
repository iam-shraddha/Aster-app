package com.hypermind.implantcard.model.implants

import jakarta.persistence.*

class PatientwithImplantbyhosp {

    var patient: Patient? = null
    var patientImplantInfoList: List<PatientImplantInfo>? = null
}