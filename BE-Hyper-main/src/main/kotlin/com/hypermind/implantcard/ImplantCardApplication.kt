package com.hypermind.implantcard

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ImplantCardApplication

fun main(args: Array<String>) {

	try {
		Class.forName("org.h2.Driver")
	} catch (e: ClassNotFoundException) {
		e.printStackTrace()
	}
	runApplication<ImplantCardApplication>(*args)
}
