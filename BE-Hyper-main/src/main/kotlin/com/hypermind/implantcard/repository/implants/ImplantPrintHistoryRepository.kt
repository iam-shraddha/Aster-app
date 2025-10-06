package com.hypermind.implantcard.repository.implants

import com.hypermind.implantcard.model.db.implants.ImplantPrintHistory
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ImplantPrintHistoryRepository : JpaRepository<ImplantPrintHistory, Long>{
    fun findByHospitalId(hospitalId: Int): List<ImplantPrintHistory>
}
