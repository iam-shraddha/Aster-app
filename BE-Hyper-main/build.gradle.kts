plugins {
	id("org.springframework.boot") version "3.3.0"
	id("io.spring.dependency-management") version "1.1.0"
	kotlin("jvm") version "1.9.0"
	kotlin("plugin.spring") version "1.9.0"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
//	implementation("com.mysql:mysql-connector-j")
    implementation("mysql:mysql-connector-java:8.0.30")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	implementation("org.springdoc:springdoc-openapi-ui:1.7.0")
	implementation("org.springdoc:springdoc-openapi-data-rest:1.7.0")
	implementation("jakarta.persistence:jakarta.persistence-api:3.1.0")
	implementation("com.auth0:auth0-spring-security-api:1.4.0")
	implementation("org.apache.httpcomponents.client5:httpclient5")
	implementation("com.auth0:auth0:1.36.0")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
	implementation("org.springframework.security:spring-security-oauth2-jose")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("com.h2database:h2")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("com.google.code.gson:gson:2.8.9")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	implementation("mysql:mysql-connector-java:8.0.30")

	implementation("com.itextpdf:kernel:7.2.5")
	implementation("com.itextpdf:layout:7.2.5")
	implementation("com.itextpdf:io:7.2.5")
	//implementation ("org.slf4j:slf4j-api:1.7.30")
	implementation ("ch.qos.logback:logback-classic:1.4.12") // Add this line for Logback
	implementation ("com.itextpdf:itext7-core:7.2.5")
	implementation("org.apache.pdfbox:pdfbox:2.0.27")
	implementation("com.itextpdf:itext7-core:7.1.9")
	implementation("com.twelvemonkeys.imageio:imageio-core:3.7.0")
	implementation("com.twelvemonkeys.imageio:imageio-pdf:3.7.0")





}
tasks.bootJar {
	archiveFileName.set("myapp.jar")
	duplicatesStrategy = DuplicatesStrategy.EXCLUDE
}
