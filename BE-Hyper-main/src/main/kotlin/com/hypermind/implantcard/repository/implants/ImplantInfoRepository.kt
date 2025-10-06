package com.hypermind.implantcard.repository.implants

import com.hypermind.implantcard.model.db.implants.ImplantInfoEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ImplantInfoRepository : JpaRepository<ImplantInfoEntity,Integer> {

    fun findByCompanyName(companyName: String): List<ImplantInfoEntity>
}