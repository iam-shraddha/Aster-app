package com.hypermind.implantcard.service.implants

import com.hypermind.implantcard.model.db.implants.ImplantInfoEntity
import com.hypermind.implantcard.model.implants.ImplantInfo
import com.hypermind.implantcard.repository.implants.ImplantInfoRepository
import org.springframework.stereotype.Service
import java.util.stream.Collectors

@Service
class ImplantInfoService(private val implantInfoRepository: ImplantInfoRepository) {

    fun getAllImplantInfo(): List<ImplantInfo> {
        var findAll = implantInfoRepository.findAll()
        var implantInfos = findAll.stream().map { x -> implantInfoEntityToImplantInfo(x) }
                .collect(Collectors.toList());
        return implantInfos;
    }

    fun getImplantInfoByCompanyName(companyName: String): List<ImplantInfo> {
        val filteredImplants = implantInfoRepository.findByCompanyName(companyName)
        return filteredImplants.stream()
            .map { implantInfoEntityToImplantInfo(it) }
            .collect(Collectors.toList())
    }

    private fun implantInfoEntityToImplantInfo(implantInfoEntity: ImplantInfoEntity): ImplantInfo {

        var implantInfo = ImplantInfo()
        implantInfo.implantId = implantInfoEntity.implantId
        implantInfo.implantName = implantInfoEntity.implantName
        implantInfo.companyName = implantInfoEntity.companyName
        return implantInfo
    }
}