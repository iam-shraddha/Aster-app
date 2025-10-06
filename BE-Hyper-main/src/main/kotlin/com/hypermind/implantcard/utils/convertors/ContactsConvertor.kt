package com.hypermind.implantcard.utils.convertors

import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.ObjectMapper
import com.hypermind.implantcard.model.general.Contact
import jakarta.persistence.AttributeConverter
import java.io.IOException

class ContactsConvertor : AttributeConverter<Contact?, String> {

    private val objectMapper = ObjectMapper()

    override fun convertToDatabaseColumn(contacts: Contact?): String {
        return try {
            objectMapper.writeValueAsString(contacts)
        } catch (e: JsonProcessingException) {
            throw RuntimeException("Error converting Address to JSON", e)
        }
    }

    override fun convertToEntityAttribute(dbData: String): Contact? {
        return try {
            objectMapper.readValue(dbData, Contact::class.java)
        } catch (e: IOException) {
            throw RuntimeException("Error converting JSON to Address", e)
        }
    }

}
