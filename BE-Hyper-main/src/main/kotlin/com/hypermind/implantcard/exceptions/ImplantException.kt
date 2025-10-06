package com.hypermind.implantcard.exceptions

class ImplantException(
        message: String,
        val statusCode: Int,
        cause: Throwable ?= null
) : Exception(message,cause) {

}