package com.hypermind.implantcard.service.implants

import PatientImplantInfoSearchKey
import com.hypermind.implantcard.model.db.implants.PatientImplantInfoEntity
import com.hypermind.implantcard.model.dto.implants.PatientDTO
import com.hypermind.implantcard.model.dto.implants.PatientImplantInfoDTO
import com.hypermind.implantcard.model.dto.implants.PatientWithTheirImplantDTO
import com.hypermind.implantcard.model.implants.PatientImplantInfo
import com.hypermind.implantcard.model.implants.PatientWithTheirImplants
import com.hypermind.implantcard.repository.implants.PatientImplantInfoRepository
import com.hypermind.implantcard.repository.implants.PatientRepository
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service
import java.util.stream.Collectors
import kotlin.streams.toList

@Service
class PatientImplantInfoService(private val patientRepository: PatientRepository,
                                private val patientImplantInfoRepository: PatientImplantInfoRepository) {

    fun addNewPatientImplantInfo(patientImplantInfoDTO: PatientImplantInfoDTO): PatientImplantInfo? {

        var pII = piiDTOTopii(patientImplantInfoDTO)

        if (!validatePII(pII))
            return null

        var pIIEntity = piiTopiiEntity(pII)
        var findById = patientRepository.findById(pII.patientId)

        if (null == findById)
            return null;

        var savedPII = patientImplantInfoRepository.save(pIIEntity)
        var pIIEntityTopII = piiEntityTopii(savedPII)

        return pIIEntityTopII
    }

    fun getDetailsByPatientId(id: String): List<PatientImplantInfo>? {

        var detailsByPatientId = patientImplantInfoRepository.findByPatientId(id);

        if (null == detailsByPatientId)
            return null;

        var collection = detailsByPatientId.stream()
            .filter { x ->
                (x.isActive != false)
            }
            .map { d ->
                piiEntityTopii(d)
            }.collect(Collectors.toList());

        return collection
    }


    fun getPatientImplantInfoBySearchKey(patientImplantInfoSearchKey: PatientImplantInfoSearchKey): PatientImplantInfo? {

        var pIIEntity = patientImplantInfoRepository.findById(patientImplantInfoSearchKey)
        if (null == pIIEntity.get())
            return null;

        var pII = piiEntityTopii(pIIEntity.get())
        return pII
    }

    fun updatePatientImplantInfoDetail(patientImplantInfo: PatientImplantInfo): PatientImplantInfo? {

        var patientImplantInfoSearchKey = PatientImplantInfoSearchKey()
        patientImplantInfoSearchKey.patientId = patientImplantInfo.patientId
        patientImplantInfoSearchKey.implantId = patientImplantInfo.implantId
        patientImplantInfoSearchKey.operationDate = patientImplantInfo.operationDate

        var existsById = patientImplantInfoRepository.existsById(patientImplantInfoSearchKey)
        if (existsById == null)
            return null

        var toUpdatePIIEntity = piiTopiiEntity(patientImplantInfo)
        var updatedPIIEntity = patientImplantInfoRepository.save(toUpdatePIIEntity)
        var updatedPII = piiEntityTopii(updatedPIIEntity)
        return updatedPII;
    }

    fun savePatientImplantInfo(patientImplantInfoList: List<PatientImplantInfo>): List<PatientImplantInfo>? {

        var patientId: String? = null;

        if (null == patientImplantInfoList && null == patientImplantInfoList.get(0) && null == patientImplantInfoList.get(
                0
            ).patientId
        )
            return null;
        patientId = patientImplantInfoList.get(0).patientId;

        var detailsByPatientId = patientImplantInfoRepository.findByPatientId(patientId);

        var toList = patientImplantInfoList.stream().map { x ->
            piiTopiiEntity(x)
        }.toList()

        var compositeKeysToRemove = patientImplantInfoList.stream()
            .map { it.patientId to it.implantId to it.operationDate }.toList()

        if (detailsByPatientId != null && detailsByPatientId.size > 0) {

            var patientImplantInfoRemoved = detailsByPatientId.filterNot {
                (it.patientId to it.implantId to it.operationDate) in compositeKeysToRemove
            }.toList()

            patientImplantInfoRemoved.forEach { x ->
                x.isActive = false
            }

            if (null == patientImplantInfoRemoved)
                toList.addAll(patientImplantInfoRemoved)
        }

        var savedAll = patientImplantInfoRepository.saveAll(toList)

        var updatedPatientImplantInfoList = savedAll.stream().map { x ->
            piiEntityTopii(x)
        }.toList()

        return updatedPatientImplantInfoList
    }


    private fun piiDTOTopii(patientImplantInfoDTO: PatientImplantInfoDTO): PatientImplantInfo {

        var patientImplantInfo = PatientImplantInfo()
        patientImplantInfo.patientId = patientImplantInfoDTO.patientId
        patientImplantInfo.implantId = patientImplantInfoDTO.implantId
        patientImplantInfo.implantName = patientImplantInfoDTO.implantName
        patientImplantInfo.operationSide = patientImplantInfoDTO.operationSide
        patientImplantInfo.operationDate = patientImplantInfoDTO.dateOfSurgery
        return patientImplantInfo
    }

    private fun piiTopiiEntity(patientImplantInfo: PatientImplantInfo): PatientImplantInfoEntity {

        var patientImplantInfoEntity = PatientImplantInfoEntity()
        patientImplantInfoEntity.patientId = patientImplantInfo.patientId
        patientImplantInfoEntity.implantId = patientImplantInfo.implantId
        patientImplantInfoEntity.implantName = patientImplantInfo.implantName
        patientImplantInfoEntity.operationDate = patientImplantInfo.operationDate
        patientImplantInfoEntity.operationSide = patientImplantInfo.operationSide
        patientImplantInfoEntity.isActive = patientImplantInfo.isActive
        return patientImplantInfoEntity
    }

    private fun piiEntityTopii(patientImplantInfoEntity: PatientImplantInfoEntity): PatientImplantInfo {

        var patientImplantInfo = PatientImplantInfo()
        patientImplantInfo.patientId = patientImplantInfoEntity.patientId
        patientImplantInfo.implantId = patientImplantInfoEntity.implantId
        patientImplantInfo.implantName = patientImplantInfoEntity.implantName
        patientImplantInfo.operationSide = patientImplantInfoEntity.operationSide
        patientImplantInfo.operationDate = patientImplantInfoEntity.operationDate
        patientImplantInfo.isActive = patientImplantInfoEntity.isActive

        return patientImplantInfo
    }

    private fun validatePII(patientImplantInfo: PatientImplantInfo): Boolean {
        return true
    }

    // ==============================

    fun getPatientsByHospitalId(hospitalId: Int, pageable: Pageable): Page<PatientWithTheirImplantDTO> {
        val paginatedPatients = patientRepository.findAllByHospitalId(hospitalId, pageable)

        return paginatedPatients.map { patientEntity ->
            // Fetch only active implants associated with the patient
            val implants = if (patientEntity.patientId != null) {
                patientImplantInfoRepository.findActiveByPatientId(patientEntity.patientId!!)
            } else {
                emptyList() // Return empty if patientId is null
            }

            // Create PatientDTO and assign values
            val patientDTO = PatientDTO().apply {
                patientId = patientEntity.patientId
                patientName = patientEntity.patientName
                gender = patientEntity.gender
                age = patientEntity.age
                // Access hospitalId from hospitalEntity
                this.hospitalId = patientEntity.hospitalEntity?.hospitalId
            }

            // Map implants to PatientImplantInfoDTO
            val patientImplantInfoDTOList = implants?.map { implantEntity ->
                PatientImplantInfoDTO().apply {
                    patientId = implantEntity.patientId
                    implantId = implantEntity.implantId
                    implantName = implantEntity.implantName
                    operationSide = implantEntity.operationSide
                    dateOfSurgery = implantEntity.operationDate
                }
            }

            // Return PatientWithTheirImplantDTO with patient and implant details
            PatientWithTheirImplantDTO().apply {
                this.patient = patientDTO
                if (patientImplantInfoDTOList != null) {
                    this.patientImplantInfoList = patientImplantInfoDTOList
                }
            }
        }
    }





}