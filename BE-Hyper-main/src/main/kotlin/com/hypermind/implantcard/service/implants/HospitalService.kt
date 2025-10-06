package com.hypermind.implantcard.service.implants

import com.hypermind.implantcard.model.db.implants.HospitalEntity
import com.hypermind.implantcard.model.dto.implants.HospitalDTO
import com.hypermind.implantcard.model.implants.Hospital
import com.hypermind.implantcard.repository.implants.HospitalRepository
import org.springframework.stereotype.Service
import kotlin.jvm.optionals.getOrNull


@Service
class HospitalService(private val hospitalRepository: HospitalRepository)  {

    fun addNewHospital(hospitalDTO: HospitalDTO): Hospital {

        var hospital = hospitalDTOToHospital(hospitalDTO)
        validateHospital(hospital)
        var hospitalEntity = hospitalToHospitalEntity(hospital)
        var savedHospitalEntity = hospitalRepository.save(hospitalEntity)
        return hospitalEntityToHospital(savedHospitalEntity)
    }

    fun updateHospitalDetail(hospital: Hospital) : Hospital {

        var hospitalEntity = hospitalToHospitalEntity(hospital)
        hospitalEntity.hospitalId = hospital.hospitalId
        var updatedHospitalEntity = hospitalRepository.save(hospitalEntity)
        hospitalEntityToHospital(updatedHospitalEntity)
        return hospital
    }

    fun getHospital(id : Int) : Hospital? {
        var hospitalById = hospitalRepository.findById(id)
        var hospitalEntity = hospitalById.getOrNull()

        if (null == hospitalEntity)
            return null

        var hospital = hospitalEntityToHospital(hospitalEntity)
        return hospital
    }

    fun getHospitalByName(name: String): HospitalEntity? {
        return hospitalRepository.findByHospitalName(name)
    }

    fun getAllHospitals(): List<Hospital> {
        val hospitalEntities = hospitalRepository.findAll()
        return hospitalEntities.map { hospitalEntityToHospital(it) }
    }

    private fun hospitalDTOToHospital(hospitalDTO: HospitalDTO): Hospital{

        var hospital = Hospital()
        hospital.hospitalName = hospitalDTO.hospitalName
        hospital.contactNumber = hospitalDTO.contactNumber
        hospital.websiteAddress= hospitalDTO.websiteAddress
        hospital.emailId = hospitalDTO.emailId
        hospital.signature = hospitalDTO.signature
        hospital.logoFt = hospitalDTO.logoFt
        hospital.logoHd = hospitalDTO.logoHd
        return hospital
    }

    private fun hospitalToHospitalEntity(hospital: Hospital): HospitalEntity{

        var hospitalEntity = HospitalEntity()
        hospitalEntity.hospitalId = hospital.hospitalId
        hospitalEntity.hospitalName = hospital.hospitalName
        hospitalEntity.contactNumber = hospital.contactNumber
        hospitalEntity.websiteAddress = hospital.websiteAddress
        hospitalEntity.emailId = hospital.emailId
        hospitalEntity.signature = hospital.signature
        hospitalEntity.logoFt = hospital.logoFt
        hospitalEntity.logoHd = hospital.logoHd
        return hospitalEntity
    }

    private fun hospitalEntityToHospital(hospitalEntity: HospitalEntity): Hospital{

        var hospital = Hospital()
        hospital.hospitalId = hospitalEntity.hospitalId!!
        hospital.hospitalName = hospitalEntity.hospitalName
        hospital.contactNumber = hospitalEntity.contactNumber
        hospital.websiteAddress = hospitalEntity.websiteAddress
        hospital.emailId = hospitalEntity.emailId
        hospital.signature = hospitalEntity.signature
        hospital.logoFt = hospitalEntity.logoFt
        hospital.logoHd = hospitalEntity.logoHd
        return hospital
    }

    private fun validateHospital(hospital: Hospital): Boolean {
        return true
    }
}