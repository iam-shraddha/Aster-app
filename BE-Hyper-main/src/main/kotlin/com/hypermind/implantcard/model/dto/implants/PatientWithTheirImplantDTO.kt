package com.hypermind.implantcard.model.dto.implants

class PatientWithTheirImplantDTO {
    var patient: PatientDTO? = null
    var patientImplantInfoList: List<PatientImplantInfoDTO> = listOf()
}