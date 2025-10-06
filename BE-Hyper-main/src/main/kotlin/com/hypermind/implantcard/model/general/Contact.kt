package com.hypermind.implantcard.model.general

import java.io.Serializable

data class Contact(

        var phoneNumber: String? = null,
        var emailId: String? = null,
        var website: String? = null,
        var address: String? = null,
        var pinCode: String? = null,
        var cityOrTown: String? = null,
        var state: String? = null,
        var country: String? = null
)