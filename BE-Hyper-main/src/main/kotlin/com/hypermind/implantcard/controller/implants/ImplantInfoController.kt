package com.hypermind.implantcard.controller.implants


import com.hypermind.implantcard.model.implants.ImplantInfo
import com.hypermind.implantcard.service.implants.ImplantInfoService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/implantInfo")
class ImplantInfoController(private val implantInfoService: ImplantInfoService) {
    @GetMapping("/getAllImplantInfo")
       fun getAllImplantInfo(): List<ImplantInfo> {
        var allImplantInfo = implantInfoService.getAllImplantInfo()
        return allImplantInfo
    }

    @GetMapping("/getImplantInfoByCompany")
    fun getImplantInfoByCompany(): List<ImplantInfo> {
        // Removed J&J filter as per feedback 5 - now shows all implants from DB
        return implantInfoService.getAllImplantInfo()
    }
}