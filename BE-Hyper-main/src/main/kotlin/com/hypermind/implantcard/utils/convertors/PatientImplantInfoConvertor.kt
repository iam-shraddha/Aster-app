//package com.hypermind.implantcard.utils.convertors
//
//import com.fasterxml.jackson.core.JsonProcessingException
//import com.fasterxml.jackson.databind.ObjectMapper
//import com.fasterxml.jackson.module.kotlin.readValue
//import com.hypermind.implantcard.model.implants.PatientImplantInfo
//import jakarta.persistence.AttributeConverter
//import java.io.IOException
//
//class PatientImplantInfoConvertor : AttributeConverter<List<PatientImplantInfo> ?, String> {
//
//    private val objectMapper = ObjectMapper()
//
//    override fun convertToDatabaseColumn(contacts: List<PatientImplantInfo>?): String {
//        return try {
//            objectMapper.writeValueAsString(contacts)
//        } catch (e: JsonProcessingException) {
//            throw RuntimeException("Error converting Address to JSON", e)
//        }
//    }
//
//    override fun convertToEntityAttribute(dbData: String?): List<PatientImplantInfo>? {
//        return try {
//            dbData?.let {
//                objectMapper.readValue<List<PatientImplantInfo>>(it)
//            }
//        } catch (e: Exception) {
//            throw RuntimeException("Could not convert JSON to list", e)
//        }
//    }
//}