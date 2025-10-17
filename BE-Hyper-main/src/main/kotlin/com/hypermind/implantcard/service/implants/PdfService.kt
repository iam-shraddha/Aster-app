//package com.hypermind.implantcard.service.implants
//
////import com.hypermind.implantcard.service.implants.PatientWithImplants
//
//import com.hypermind.implantcard.model.implants.Hospital
//import com.hypermind.implantcard.model.implants.Patient
//import com.hypermind.implantcard.model.implants.PatientWithTheirImplants
//import com.itextpdf.io.image.ImageDataFactory
//import com.itextpdf.io.source.ByteArrayOutputStream
//import com.itextpdf.kernel.colors.Color
//import com.itextpdf.kernel.colors.ColorConstants
//import com.itextpdf.kernel.colors.DeviceRgb
//import com.itextpdf.kernel.geom.PageSize
//import com.itextpdf.kernel.pdf.PdfDocument
//import com.itextpdf.kernel.pdf.PdfReader
//import com.itextpdf.kernel.pdf.PdfWriter
//import com.itextpdf.kernel.pdf.canvas.PdfCanvas
//import com.itextpdf.layout.Document
//import com.itextpdf.layout.element.Image
//import com.itextpdf.layout.element.Paragraph
//import com.itextpdf.layout.properties.TextAlignment
//import org.apache.pdfbox.pdmodel.PDDocument
//import org.apache.pdfbox.rendering.PDFRenderer
//import org.springframework.stereotype.Service
//import org.springframework.web.client.RestTemplate
//import java.awt.Graphics2D
//import java.awt.image.BufferedImage
//import java.io.ByteArrayInputStream
//import java.io.File
//import javax.imageio.ImageIO
//import java.awt.*
//import java.awt.geom.RoundRectangle2D
//
//@Service
//        class PdfService {
        //
        //    fun generatePdf(patientWithImplants: PatientWithTheirImplants, hospital: Hospital): ByteArray {
        //        val outputDirectory = File("generated_pdfs")
        //        if (!outputDirectory.exists()) {
        //            outputDirectory.mkdirs()
        //        }
        //
        //        try {
        //            // Generate separate PDFs for each card
        //            val frontCardStream = ByteArrayOutputStream()
        //            val backCardStream = ByteArrayOutputStream()
        //
        //            // Generate front and back PDFs as ByteArrayOutputStreams
        //            // val frontCardStream = ByteArrayOutputStream()
        //            // val backCardStream = ByteArrayOutputStream()
        //            addFrontCard(frontCardStream, hospital, patientWithImplants.patient)
        //            generateBackCard(backCardStream, hospital, patientWithImplants)
        //            //addFrontCard(frontCardPath, hospital, patientWithImplants.patient)
        //            //generateBackCard(backCardPath, hospital, patientWithImplants)
        //
        //            // Merge the generated PDFs into a single PDF
        //            // val mergedPdfPath = "generated_pdfs/merged_patient_hospital_card.pdf"
        //            val mergedPdfStream = ByteArrayOutputStream()
        //            //mergePdfs(listOf(frontCardPath,backCardPath), mergedPdfPath)
        //            mergePdfs(listOf(frontCardStream.toByteArray(), backCardStream.toByteArray()), mergedPdfStream)
        //            // Save the merged PDF separately
        //            //savePdfToFile(mergedPdfPath)
        //
        //            // Return the merged PDF as ByteArray
        //            //return File(mergedPdfPath).readBytes()
        //            return mergedPdfStream.toByteArray()
        //        } catch (e: Exception) {
        //            e.printStackTrace()
        //            throw RuntimeException("Error generating PDF: ${e.message}")
        //        }
        //    }
        //
        //
        //    // Convert PDF to JPEG and return image paths
        //    fun convertPdfToJpegPages(pdfBytes: ByteArray): List<ByteArray> {
        //        val pdDocument = PDDocument.load(ByteArrayInputStream(pdfBytes))
        //        val pdfRenderer = PDFRenderer(pdDocument)
        //        val pages = mutableListOf<ByteArray>()
        //
        //        try {
        //            // Convert both pages to JPEG
        //            for (pageIndex in 0..1) {
        //                val image = pdfRenderer.renderImageWithDPI(pageIndex, 150f)
        //                val outputStream = ByteArrayOutputStream()
        //                ImageIO.write(image, "JPEG", outputStream)
        //                pages.add(outputStream.toByteArray())
        //            }
        //        } finally {
        //            pdDocument.close()
        //        }
        //
        //        return pages
        //    }
        //
        ////================================================
        //
        //    fun generateCombinedCardsPdf(patientWithImplants: PatientWithTheirImplants, hospital: Hospital): ByteArray {
        //        val outputDirectory = File("generated_pdfs")
        //        if (!outputDirectory.exists()) {
        //            outputDirectory.mkdirs()
        //        }
        //
        //        try {
        //            val combinedPdfStream = ByteArrayOutputStream()
        //
        //            // Create a combined PDF with both cards on the same page
        //            val pdfWriter = PdfWriter(combinedPdfStream)
        //            val pdfDocument = PdfDocument(pdfWriter)
        //            val document = Document(pdfDocument, PageSize.A4)
        //
        //            val pageWidth = PageSize.A4.width
        //            val pageHeight = PageSize.A4.height
        //
        //            // Adjust card size (make them bigger)
        //            val cardWidth = 350f
        //            val cardHeight = 250f
        //
        //            // Calculate positions to center the cards
        //            val frontCardX = (pageWidth - cardWidth) / 2 // Center horizontally
        //            val frontCardY = (pageHeight / 2) + (cardHeight / 2) // Center vertically for the first card
        //
        //            val backCardX = frontCardX
        //            val backCardY = frontCardY - cardHeight - 20f
        //
        //            addFrontCardNew(document, hospital, patientWithImplants.patient, frontCardX, frontCardY)
        //
        //            generateBackCardNew(document, hospital, patientWithImplants, backCardX, backCardY)
        //
        //            // Close the document
        //            document.close()
        //
        //            return combinedPdfStream.toByteArray()
        //
        //        } catch (e: Exception) {
        //            e.printStackTrace()
        //            throw RuntimeException("Error generating combined PDF: ${e.message}")
        //        }
        //    }
        //
        //
        //
        //    // ... rest of the code ...
        //
        //    private fun savePdfToFile(filePath: String) {
        //        val file = File(filePath)
        //        file.writeBytes(File(filePath).readBytes())
        //    }
        //}
        //
        //
        //
        //private fun fetchImageBytes(url: String): ByteArray {
        //    println("Fetching image from URL: $url")
        //    val restTemplate = RestTemplate()
        //    return restTemplate.getForObject(url, ByteArray::class.java)
        //        ?: throw RuntimeException("Unable to fetch image from URL: $url")
        //}
        //
        //
        //fun addFrontCardNew(document: Document, hospital: Hospital, patient: Patient?, xPosition: Float, yPosition: Float) {
        //    val pdfDocument = document.pdfDocument
        //
        //    // Ensure there is at least one page in the document
        //    if (pdfDocument.numberOfPages == 0) {
        //        pdfDocument.addNewPage()
        //    }
        //
        //    val canvas = PdfCanvas(pdfDocument.getLastPage()) // Access the last page
        //    createFirstCard(hospital, document, xPosition, yPosition)
        //}
        //
        //fun generateBackCardNew(document: Document, hospital: Hospital, patientWithImplants: PatientWithTheirImplants?, xPosition: Float, yPosition: Float) {
        //    val pdfDocument = document.pdfDocument
        //
        //    // Ensure there is at least one page in the document
        //    if (pdfDocument.numberOfPages == 0) {
        //        pdfDocument.addNewPage()
        //    }
        //
        //    val canvas = PdfCanvas(pdfDocument.getLastPage()) // Access the last page
        //    createSecondCard(hospital, document, xPosition, yPosition, patientWithImplants)
        //}
        //
        //
        //
        //
        //
        ////--First Card
        //
        //    fun addFrontCard(outputStream: ByteArrayOutputStream, hospital: Hospital, patient: Patient?) {
        //
        //       // val outputDirectory = File(filePath).parentFile
        //      //  if (outputDirectory != null && !outputDirectory.exists()) {
        //     //       outputDirectory.mkdirs()
        //      //  }
        //
        //        val pdfWriter = PdfWriter(outputStream)
        //        val pdfDocument = PdfDocument(pdfWriter)
        //        val document = Document(pdfDocument, PageSize.A4)
        //        val page = pdfDocument.addNewPage()
        //        val canvas = PdfCanvas(page)
        //        val xPosition = 50f
        //        val yPosition = 500f
        //
        //        // Add first card (Front Card)
        //        createFirstCard(hospital, document, xPosition, yPosition)
        //
        //        // Add footer
        //        addFooterWithImage(hospital, document, xPosition, yPosition, 240.945f, 50f)
        //
        //        pdfDocument.close()
        //        println("Front PDF generated successfully. ")
        //    }
        //
        //
        //
        //
        //
        //    private fun createFirstCard(hospital: Hospital, document: Document, xPosition: Float, yPosition: Float) {
        //        val cardWidth = 240.945f
        //        val cardHeight = 155.906f
        //        val warningRowHeight = 60f
        //        val footerHeight = 50f
        //        val rowYPosition = yPosition + 60f
        //
        //        // Draw card background with rounded corners
        //        drawCardBackground(PdfCanvas(document.pdfDocument.getLastPage()), xPosition, yPosition, cardWidth, cardHeight)
        //
        //        // Add card content
        //        addLogos(hospital,document, xPosition, yPosition, cardWidth, cardHeight)
        //
        //        addWarningRow(hospital,document, xPosition, rowYPosition, cardWidth, warningRowHeight, "img/patient_implant.jpg")
        //
        //        // Calculate the Y position for the footer to immediately follow the warning row
        //        val footerYPosition = yPosition
        //
        //        addFooterWithImage(hospital, document, xPosition, footerYPosition, cardWidth, footerHeight)
        //    }
        ////
        //
        //
        //
        //    fun drawCardBackground(canvas: PdfCanvas, xPosition: Float, yPosition: Float, cardWidth: Float, cardHeight: Float) {
        //        val cornerRadius = 10.0
        //        canvas
        //            .setFillColor(ColorConstants.WHITE)
        //            .roundRectangle(
        //                xPosition.toDouble(), yPosition.toDouble(), cardWidth.toDouble(), cardHeight.toDouble(), cornerRadius
        //            )
        //            .fill()
        //            .setStrokeColor(ColorConstants.BLACK)
        //            .roundRectangle(
        //                xPosition.toDouble(), yPosition.toDouble(), cardWidth.toDouble(), cardHeight.toDouble(), cornerRadius
        //            )
        //            .stroke()
        //    }
        //
        //
        //fun addLogos(hospital:Hospital,document: Document, xPosition: Float, yPosition: Float, cardWidth: Float, cardHeight: Float) {
        //    val logoWidthLeft = 40f
        //    val logoHeight = 20f
        //    val logoWidthRight = 20f
        //
        //    val leftLogoBytes = hospital.logoFt?.let { fetchImageBytes(it) }
        //    val rightLogoBytes = hospital.logoHd?.let { fetchImageBytes(it) }
        //
        //    val leftLogo = Image(ImageDataFactory.create(leftLogoBytes))
        //        .setWidth(logoWidthLeft)
        //        .setHeight(logoHeight)
        //        .setFixedPosition(xPosition + 10f, yPosition + cardHeight - logoHeight - 10f)
        //    document.add(leftLogo)
        //
        //    val rightLogo = Image(ImageDataFactory.create(rightLogoBytes))
        //        .setWidth(logoWidthRight)
        //        .setHeight(logoHeight)
        //        .setFixedPosition(
        //            xPosition + cardWidth - logoWidthRight - 10f,
        //            yPosition + cardHeight - logoHeight - 10f
        //        )
        //    document.add(rightLogo)
        //}
        //
        //
        //
        //
        //    fun addWarningRow(hospital: Hospital, document: Document, xPosition: Float, rowYPosition: Float, cardWidth: Float, rowHeight: Float, imagePath: String) {
        //
        //        val warningTextWidth = (cardWidth * 3) / 4
        //        val imageWidth = cardWidth / 4
        //        val updatedRowHeight = 60f
        //        val imageHeight = updatedRowHeight
        //        val canvas = PdfCanvas(document.pdfDocument.getLastPage())
        //        canvas
        //            .setFillColorRgb(0f, 0.3f, 0.3f)
        //            .rectangle(
        //                xPosition.toDouble(), rowYPosition.toDouble(), warningTextWidth.toDouble(), updatedRowHeight.toDouble()
        //            )
        //            .fill()
        //
        //        val warningText =
        //            Paragraph("The person has a metal implant in their body, which could potentially trigger a metal detection device.")
        //                .setFontSize(10f)
        //                .setTextAlignment(TextAlignment.LEFT)
        //                .setFixedPosition(xPosition + 10f, rowYPosition + 10f, warningTextWidth - 20f)
        //                .setFontColor(ColorConstants.WHITE)
        //
        //        document.add(warningText)
        //
        //        val url = PdfService::class.java.classLoader.getResource(imagePath)
        //        val image = Image(ImageDataFactory.create(url))
        //            .setWidth(imageWidth)
        //            .setHeight(imageHeight)
        //            .setFixedPosition(xPosition + warningTextWidth, rowYPosition)
        //        document.add(image)
        //    }
        //
        //
        //    fun addFooterWithImage(
        //
        //        hospital: Hospital,
        //        document: Document,
        //        xPosition: Float,
        //        rowYPosition: Float,
        //        cardWidth: Float,
        //        rowHeight: Float
        //    ) {
        //        val updatedRowHeight = 50f
        //        val halfWidth = cardWidth / 2
        //        val radius = 15.3 // Radius for rounded bottom corners
        //        val textTopPadding = -10f // Top padding for the text
        //
        //        // Get the canvas to draw the background
        //        val canvas = PdfCanvas(document.pdfDocument.getLastPage())
        //
        //        // Draw the footer background with rounded bottom corners
        //        canvas
        //            .setFillColorRgb(0.9F, 0.9F, 0.9F) // Light gray color
        //            .moveTo(xPosition.toDouble(), (rowYPosition + updatedRowHeight).toDouble()) // Top-left
        //            .lineTo(xPosition.toDouble(), (rowYPosition + radius).toDouble()) // Left vertical
        //            .curveTo(
        //                xPosition.toDouble(), rowYPosition.toDouble(), // Control point for rounding
        //                (xPosition + radius).toDouble(), rowYPosition.toDouble() // End of bottom-left curve
        //            )
        //            .lineTo((xPosition + cardWidth - radius).toDouble(), rowYPosition.toDouble()) // Bottom horizontal
        //            .curveTo(
        //                (xPosition + cardWidth).toDouble(), rowYPosition.toDouble(),
        //                (xPosition + cardWidth).toDouble(), (rowYPosition + radius).toDouble()
        //            )
        //            .lineTo((xPosition + cardWidth).toDouble(), (rowYPosition + updatedRowHeight).toDouble())
        //            .closePath()
        //            .fill()
        //
        //        // Add the footer text with top padding
        //        val footerText = Paragraph("${hospital.contactNumber ?: "N/A"} |  ${hospital.websiteAddress ?: "N/A"}")
        //            .setFontSize(8f)
        //            .setTextAlignment(TextAlignment.LEFT)
        //            .setFixedPosition(
        //                xPosition + 10f, // Add left padding
        //                rowYPosition + (updatedRowHeight / 2) - 7f + textTopPadding, // Apply text top padding
        //                halfWidth - 20f // Half-width with inner margin
        //            )
        //            .setFontColor(ColorConstants.BLUE)
        //
        //        document.add(footerText)
        //
        //        // Add the image
        //        val image =Image(ImageDataFactory.create(hospital.logoFt))
        //            .setWidth(halfWidth - 20f)
        //            .setHeight(updatedRowHeight - 10f) // Slight height adjustment
        //            .setFixedPosition(
        //                xPosition + halfWidth + 10f, // Right half of the footer
        //                rowYPosition + 5f // Standard positioning, no extra padding for the image
        //            )
        //
        //        document.add(image)
        //    }
        //
        ////--Mearge Pdfs
        //
        //
        //private fun mergePdfs(pdfBytesList: List<ByteArray>, outputStream: ByteArrayOutputStream) {
        //    val pdfWriter = PdfWriter(outputStream)
        //    val pdfDocument = PdfDocument(pdfWriter)
        //
        //    pdfBytesList.forEach { bytes ->
        //        val sourcePdf = PdfDocument(PdfReader(bytes.inputStream()))
        //        sourcePdf.copyPagesTo(1, sourcePdf.numberOfPages, pdfDocument)
        //        sourcePdf.close()
        //    }
        //
        //    pdfDocument.close()
        //    println("Merged PDF generated successfully.")
        //}
        //
        //
        ////--Second Card--
        //
        //
        //    fun generateBackCard(outputStream: ByteArrayOutputStream, hospital: Hospital, patientWithImplants: PatientWithTheirImplants?) {
        //     //   val outputDirectory = File(filePath).parentFile
        //    //    if (outputDirectory != null && !outputDirectory.exists()) {
        //      //      outputDirectory.mkdirs()
        //     //   }
        //
        //        val pdfWriter = PdfWriter(outputStream)
        //        val pdfDocument = PdfDocument(pdfWriter)
        //        val document = Document(pdfDocument, PageSize.A4)
        //        val page = pdfDocument.addNewPage()
        //        val canvas = PdfCanvas(page)
        //        val xPosition = 50f
        //        val yPosition = 500f
        //
        //        // Add first card (Front Card)
        //        createSecondCard(hospital, document, xPosition, yPosition, patientWithImplants)
        //
        //        document.close()
        //        println("Back PDF generated successfully at ")
        //    }
        //
        //
        //    fun createSecondCard(hospital: Hospital, document: Document, xPosition: Float, yPosition: Float, patientWithImplants: PatientWithTheirImplants?) {
        //        val cardWidth = 240.945f
        //        val cardHeight = 155.906f
        //        val imageRowHeight = 20f
        //        val footerHeight = 15f
        //        val imageRowYPosition = yPosition + 30f
        //
        //        // Draw card background with rounded corners
        //        val canvas = PdfCanvas(document.pdfDocument.getLastPage())
        //        drawCardBackground(canvas, xPosition, yPosition, cardWidth, cardHeight)
        //
        //        // Add card content
        //        addLogos(hospital,document, xPosition, yPosition, cardWidth, cardHeight)
        //
        //        val patient = patientWithImplants?.patient
        //        val patientName = patientWithImplants?.patient?.patientName ?: "N/A"
        //        val registrationNumber = patientWithImplants?.patient?.patientId ?: "N/A"
        //        val age = patientWithImplants?.patient?.age ?: 0  // Default age as 0 if patient is null
        //        val gender = patientWithImplants?.patient?.gender ?: "N/A"
        //
        //        // Ensure implant-related fields are also properly initialized
        //        val patientImplantInfoList = patientWithImplants?.patientImplantInfoList
        //        val operationDate = patientImplantInfoList?.firstOrNull()?.operationDate ?: "N/A"
        //        val operationSide = patientImplantInfoList?.firstOrNull()?.operationSide ?: "N/A"
        //
        //        val implantNames = patientImplantInfoList?.map { info -> info.implantName ?: "N/A" } ?: listOf()
        //
        //
        //
        //
        //        addPatientDetails(document, xPosition, yPosition, cardWidth, cardHeight, patientName, registrationNumber, operationDate, operationSide , age.toString(), gender.toString(), implantNames)
        //
        //        // Fill background for image row
        //        canvas
        //            .setFillColorRgb(0.9f, 0.9f, 0.9f)
        //            .rectangle(
        //                xPosition.toDouble(),
        //                imageRowYPosition.toDouble(),
        //                cardWidth.toDouble(),
        //                imageRowHeight.toDouble()
        //            )
        //            .fill()
        //
        //        // Add small row with authorization sign
        //        addSmallRowWithAuthSign(document, xPosition, imageRowYPosition, cardWidth,hospital)
        //
        //        // Add image row above footer
        //        addImageRowAboveFooter(hospital, document, xPosition, yPosition + footerHeight, cardWidth, imageRowHeight)
        //
        //        // Add footer
        //
        //        // Add the footer immediately below the image row
        //        addFooter(hospital, document, xPosition, yPosition, cardWidth, footerHeight)
        //    }
        //
        //
        //    fun addPatientDetails(
        //        document: Document,
        //        xPosition: Float,
        //        yPosition: Float,
        //        cardWidth: Float,
        //        cardHeight: Float,
        //        patientName: String,
        //        registrationNumber: String,
        //        operationDate: String,
        //        operationSide: String,
        //        age: String,
        //        gender: String,
        //        implantNames: List<String>
        //    ) {
        //        val implantLabel = "Implant Name: "
        //        val indentSpaces = " ".repeat(implantLabel.length)
        //
        //        val implantNameText = if (implantNames.size == 1) {
        //            implantNames.first()
        //        } else {
        //            implantNames.joinToString(separator = ",\n$indentSpaces")
        //        }
        //
        //        val detailsText = """
        //        Patient Name: $patientName
        //        Registration Number: $registrationNumber
        //        Operation Date: $operationDate
        //        Operation Side: $operationSide    Age: $age    Gender: $gender
        //        $implantLabel$implantNameText
        //    """.trimIndent()
        //
        //        val leftLogoWidth = 40f
        //        val rightLogoWidth = 20f
        //        val textPadding = 10f
        //        val textXPosition = xPosition + leftLogoWidth + textPadding
        //        val textWidth = cardWidth - leftLogoWidth - rightLogoWidth - (textPadding * 2)
        //
        //        val topPadding = 80f
        //        val leftPadding = 10f
        //
        //        val details = Paragraph(detailsText)
        //            .setFontSize(6.5f)
        //            .setTextAlignment(TextAlignment.LEFT)
        //            .setFixedPosition(textXPosition + leftPadding, yPosition + topPadding, textWidth)
        //            .setFontColor(ColorConstants.BLACK)
        //            .setBold()
        //
        //        document.add(details)
        //    }
        //
        //fun addSmallRowWithAuthSign(document: Document, xPosition: Float, rowYPosition: Float, cardWidth: Float,hospital: Hospital) {
        //
        //    val smallRowHeight = 70f
        //    val smallImageWidth = 40f
        //    val smallImageHeight = 10f
        //
        //    // Add small row above the existing row
        //    val smallRowYPosition = rowYPosition + 10f // Adjusted for the spacing
        //
        //
        //    val smallImagePath = hospital.signature?.let { fetchImageBytes(it) } // Replace with actual path of the small image
        //
        //    val smallImage = Image(ImageDataFactory.create(smallImagePath))
        //        .setWidth(smallImageWidth)
        //        .setHeight(smallImageHeight)
        //        .setFixedPosition(xPosition + cardWidth - smallImageWidth - 10f, smallRowYPosition + (smallRowHeight - smallImageHeight) / 2)
        //    document.add(smallImage)
        //
        //    // Add "Auth sign" text below the small image
        //    val authSignText = Paragraph("Auth sign")
        //        .setFontSize(8f)
        //        .setTextAlignment(TextAlignment.CENTER)
        //        .setFontColor(ColorConstants.BLACK)
        //
        //    val authSignYPosition = smallRowYPosition + smallImageHeight + 5f // Add padding to the bottom
        //
        //    val authSignWidth = cardWidth - 200f
        //    authSignText.setFixedPosition(
        //        xPosition + cardWidth - smallImageWidth - 10f, // X position (left)
        //        authSignYPosition, // Y position (bottom)
        //        authSignWidth // Width of the text block
        //    )
        //
        //    document.add(authSignText)
        //}
        //
        //
        //fun addImageRowAboveFooter(hospital: Hospital, document: Document, xPosition: Float, rowYPosition: Float, cardWidth: Float, rowHeight: Float
        //    ) {
        //        val canvas = PdfCanvas(document.pdfDocument.getLastPage())
        //
        //        // Reduce the card width by 2f
        //        val adjustedCardWidth = cardWidth
        //
        //        // Draw the gray background rectangle with reduced width
        //        canvas
        //            .setFillColorRgb(0.9f, 0.9f, 0.9f) // Light gray color
        //            .rectangle(xPosition.toDouble(), rowYPosition.toDouble(), adjustedCardWidth.toDouble(), rowHeight.toDouble())
        //            .fill()
        //
        //        // Padding values
        //        val leftPadding = 50f // Extra padding for the left image
        //        val commonPadding = 5f // Common padding for both images
        //
        //        // Dimensions for the left and right images
        //        val leftImageWidth = adjustedCardWidth / 4
        //        val rightImageWidth = adjustedCardWidth / 3
        //        val leftImageHeight = rowHeight + 10f// Image height remains the same
        //        val rightImageHeight = rowHeight + 10f // Image height remains the same
        //
        //        // Add the left image
        //
        //    // Add the left image
        //    val imagePath1 = "img/patient_implant.jpg"
        //    val url = PdfService::class.java.classLoader.getResource(imagePath1)
        //    val leftImage = Image(ImageDataFactory.create(url))
        //        .setWidth(leftImageWidth)
        //        .setHeight(leftImageHeight) // Keep image height fixed
        //        .setFixedPosition(
        //            xPosition + leftPadding,
        //            rowYPosition + commonPadding
        //        )
        //        document.add(leftImage)
        //
        //        // Add the right image
        //        val imagePath2 = hospital.logoFt?.let { fetchImageBytes(it) }
        //
        //
        //        val rightImage = Image(ImageDataFactory.create(imagePath2))
        //            .setWidth(rightImageWidth)
        //            .setHeight(rightImageHeight) // Keep image height fixed
        //            .setFixedPosition(
        //                xPosition + leftImageWidth + leftPadding + (2 * commonPadding),
        //                rowYPosition + commonPadding
        //            )
        //        document.add(rightImage)
        //    }
        //
        //    fun addFooter(
        //        hospital: Hospital,
        //        document: Document,
        //        xPosition: Float,
        //        yPosition: Float,
        //        cardWidth: Float,
        //        footerHeight: Float
        //    ) {
        //        val rowHeight = 15f
        //        val cornerRadius = 10f // Radius for the bottom corners
        //        val backgroundColor = DeviceRgb(0f, 76f / 255, 76f / 255)
        //
        //        val canvas = PdfCanvas(document.pdfDocument.getLastPage())
        //
        //        // Start drawing the shape with rounded bottom corners and sharp top corners
        //        canvas.setFillColor(backgroundColor)
        //            .moveTo(xPosition.toDouble(), (yPosition + rowHeight).toDouble()) // Top-left corner (sharp)
        //            .lineTo((xPosition + cardWidth).toDouble(), (yPosition + rowHeight).toDouble()) // Top-right corner (sharp)
        //            .lineTo(
        //                (xPosition + cardWidth).toDouble(),
        //                (yPosition + cornerRadius).toDouble()
        //            ) // Right side above the bottom-right corner
        //            .curveTo(
        //                (xPosition + cardWidth).toDouble(),
        //                yPosition.toDouble(),
        //                (xPosition + cardWidth - cornerRadius).toDouble(),
        //                yPosition.toDouble(),
        //                (xPosition + cardWidth - cornerRadius).toDouble(),
        //                yPosition.toDouble()
        //            )
        //            .lineTo((xPosition + cornerRadius).toDouble(), yPosition.toDouble()) // Bottom-left corner (rounded)
        //            .curveTo(
        //                xPosition.toDouble(),
        //                yPosition.toDouble(),
        //                xPosition.toDouble(),
        //                (yPosition + cornerRadius).toDouble(),
        //                xPosition.toDouble(),
        //                (yPosition + cornerRadius).toDouble()
        //            )
        //            .closePathFillStroke() // Close and fill the path
        //
        //        // Add footer text
        //        val footerText = Paragraph("${hospital.contactNumber ?: "N/A"} |  ${hospital.websiteAddress ?: "N/A"}")
        //            .setFontSize(7f)
        //            .setTextAlignment(TextAlignment.CENTER)
        //            .setFixedPosition(xPosition, yPosition + (rowHeight / 2) - 5f, cardWidth)
        //            .setFontColor(ColorConstants.WHITE)
        //            .setBold()
        //
        //        document.add(footerText)
//
//
//fun generatePdf(patientWithImplants: PatientWithTheirImplants, hospital: Hospital): ByteArray {
//    // Define the card dimensions
//    val cardWidth = 800 // Width of the JPEG card in pixels
//    val cardHeight = 600 // Height of the JPEG card in pixels
//
//    // Create a BufferedImage as the canvas
//    val image = BufferedImage(cardWidth, cardHeight, BufferedImage.TYPE_INT_RGB)
//    val graphics = image.createGraphics()
//
//    try {
//        // Set background color
//        graphics.color = java.awt.Color.WHITE
//        graphics.fillRect(0, 0, cardWidth, cardHeight)
//
//        // Enable anti-aliasing for better quality
//        graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
//
//        // Draw the card background with rounded corners
//        drawCardBackground(graphics, cardWidth, cardHeight)
//
//        // Add logos
//        drawLogos(graphics, hospital, cardWidth, cardHeight)
//
//        // Add patient details
//        val patient = patientWithImplants.patient
//        drawPatientDetails(graphics, patient, cardWidth, cardHeight, patientWithImplants)
//
//        // Add footer
//        drawFooter(graphics, hospital, cardWidth, cardHeight)
//
//        // Write to ByteArrayOutputStream as JPEG
//        val outputStream = ByteArrayOutputStream()
//        ImageIO.write(image, "jpeg", outputStream)
//        return outputStream.toByteArray()
//    } finally {
//        graphics.dispose() // Release graphics resources
//    }
//}
//
//// Draw the card background
//private fun drawCardBackground(graphics: Graphics2D, cardWidth: Int, cardHeight: Int) {
//    val cornerRadius = 20
//    graphics.color = java.awt.Color.LIGHT_GRAY
//    graphics.fill(RoundRectangle2D.Float(0f, 0f, cardWidth.toFloat(), cardHeight.toFloat(), cornerRadius.toFloat(), cornerRadius.toFloat()))
//}
//
//// Draw logos
//private fun drawLogos(graphics: Graphics2D, hospital: Hospital, cardWidth: Int, cardHeight: Int) {
//    val leftLogoImage = hospital.logoFt?.let { ImageIO.read(ByteArrayInputStream(fetchImageBytes(it))) }
//    val rightLogoImage = hospital.logoHd?.let { ImageIO.read(ByteArrayInputStream(fetchImageBytes(it))) }
//
//    // Draw the left logo
//    leftLogoImage?.let {
//        graphics.drawImage(it, 20, 20, 60, 40, null)
//    }
//
//    // Draw the right logo
//    rightLogoImage?.let {
//        graphics.drawImage(it, cardWidth - 80, 20, 60, 40, null)
//    }
//}
//
//// Draw patient details
//private fun drawPatientDetails(
//    graphics: Graphics2D,
//    patient: Patient?,
//    cardWidth: Int,
//    cardHeight: Int,
//    patientWithImplants: PatientWithTheirImplants
//) {
//    graphics.color = java.awt.Color.BLACK
//    graphics.font = Font("Arial", Font.PLAIN, 14)
//
//    val implantInfoList = patientWithImplants.patientImplantInfoList ?: listOf()
//    val implantDetails = implantInfoList.joinToString(separator = "\n") { info ->
//        "Implant: ${info.implantName ?: "N/A"} | Side: ${info.operationSide ?: "N/A"} | Date: ${info.operationDate ?: "N/A"}"
//    }
//
//    val details = """
//        Patient Name: ${patient?.patientName ?: "N/A"}
//        Registration Number: ${patient?.patientId ?: "N/A"}
//        Age: ${patient?.age ?: "N/A"}    Gender: ${patient?.gender ?: "N/A"}
//        $implantDetails
//    """.trimIndent()
//
//    val textX = 20
//    val textY = 100
//    val lineHeight = 20
//
//    details.lines().forEachIndexed { index, line ->
//        graphics.drawString(line, textX, textY + (index * lineHeight))
//    }
//}
//
//// Draw footer
//private fun drawFooter(graphics: Graphics2D, hospital: Hospital, cardWidth: Int, cardHeight: Int) {
//    graphics.color = java.awt.Color.DARK_GRAY
//    val footerHeight = 40
//    graphics.fillRect(0, cardHeight - footerHeight, cardWidth, footerHeight)
//
//    graphics.color = java.awt.Color.WHITE
//    graphics.font = Font("Arial", Font.BOLD, 12)
//    val footerText = "${hospital.contactNumber ?: "N/A"} | ${hospital.websiteAddress ?: "N/A"}"
//    graphics.drawString(footerText, 20, cardHeight - 15)
//}
//
//// Fetch image bytes (example implementation)
//private fun fetchImageBytes(url: String): ByteArray {
//    val restTemplate = RestTemplate()
//    return restTemplate.getForObject(url, ByteArray::class.java)
//        ?: throw RuntimeException("Unable to fetch image from URL: $url")
//}
//
//}
package com.hypermind.implantcard.service.implants

import com.hypermind.implantcard.model.implants.Doctor
import com.hypermind.implantcard.model.implants.Hospital
import com.hypermind.implantcard.model.implants.PatientWithTheirImplants
import com.hypermind.implantcard.service.implants.DoctorService
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import java.awt.*
import java.awt.geom.RoundRectangle2D
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileNotFoundException
import java.io.InputStream
import java.net.URL
import javax.imageio.ImageIO
import kotlin.math.roundToInt

@Service
class PdfService(private val doctorService: DoctorService) {

    companion object {
        private const val CARD_WIDTH = 600
        private const val CARD_HEIGHT = 380
        private const val PADDING = 24
        private const val CORNER_RADIUS = 16
        private const val TOP_LOGO_PADDING = 15 
    }

    fun generatePdf(patientWithImplants: PatientWithTheirImplants, hospital: Hospital): ByteArray {
        val totalHeight = CARD_HEIGHT * 2 + PADDING
        val image = BufferedImage(CARD_WIDTH, totalHeight, BufferedImage.TYPE_INT_RGB)
        val graphics = image.createGraphics()

        try {
            // Enable anti-aliasing
            graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
            graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON)

        // Set background
        graphics.color = Color.decode("#F8F9FA")
        graphics.fillRect(0, 0, CARD_WIDTH, totalHeight)

            // Draw the front and back cards
            drawFrontCard(graphics, hospital, patientWithImplants)
            drawBackCard(graphics, hospital, patientWithImplants)

            // Write the final image as JPEG
            val outputStream = ByteArrayOutputStream()
            ImageIO.write(image, "jpeg", outputStream)
            return outputStream.toByteArray()
        } finally {
            graphics.dispose()
        }
    }

    fun generateImage(patientWithImplants: PatientWithTheirImplants, hospital: Hospital): List<ByteArray> {
        val frontImage = generateFrontImage(patientWithImplants, hospital)
        val backImage = generateBackImage(patientWithImplants, hospital)

        return listOf(frontImage, backImage)
    }

    // New methods with doctor support
    fun generatePdf(patientWithImplants: PatientWithTheirImplants, hospital: Hospital, doctorId: Int? = null): ByteArray {
        val doctor = doctorId?.let { doctorService.getDoctorById(it) }
        return generatePdfWithDoctor(patientWithImplants, hospital, doctor)
    }

    fun generateImage(patientWithImplants: PatientWithTheirImplants, hospital: Hospital, doctorId: Int? = null): List<ByteArray> {
        val doctor = doctorId?.let { doctorService.getDoctorById(it) }
        return generateImageWithDoctor(patientWithImplants, hospital, doctor)
    }

    private fun generatePdfWithDoctor(patientWithImplants: PatientWithTheirImplants, hospital: Hospital, doctor: Doctor?): ByteArray {
        val totalHeight = CARD_HEIGHT * 2 + PADDING
        val image = BufferedImage(CARD_WIDTH, totalHeight, BufferedImage.TYPE_INT_RGB)
        val graphics = image.createGraphics()

        try {
            // Enable anti-aliasing
            graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
            graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON)

        // Set background
        graphics.color = Color.decode("#F8F9FA")
        graphics.fillRect(0, 0, CARD_WIDTH, totalHeight)

            // Draw the front and back cards
            drawFrontCard(graphics, hospital, patientWithImplants)
            drawBackCardWithDoctor(graphics, hospital, patientWithImplants, doctor)

            // Write the final image as JPEG
            val outputStream = ByteArrayOutputStream()
            ImageIO.write(image, "jpeg", outputStream)
            return outputStream.toByteArray()
        } finally {
            graphics.dispose()
        }
    }

    private fun generateImageWithDoctor(patientWithImplants: PatientWithTheirImplants, hospital: Hospital, doctor: Doctor?): List<ByteArray> {
        val frontImage = generateFrontImage(patientWithImplants, hospital)
        val backImage = generateBackImageWithDoctor(patientWithImplants, hospital, doctor)

        return listOf(frontImage, backImage)
    }

    private fun generateFrontImage(patientWithImplants: PatientWithTheirImplants, hospital: Hospital): ByteArray {
        val image = BufferedImage(CARD_WIDTH, CARD_HEIGHT, BufferedImage.TYPE_INT_RGB)
        val graphics = image.createGraphics()
        try {
            initializeGraphics(graphics)
            drawFrontCard(graphics, hospital, patientWithImplants)
            return writeImageToByteArray(image)
        } finally {
            graphics.dispose()
        }
    }

    private fun generateBackImage(patientWithImplants: PatientWithTheirImplants, hospital: Hospital): ByteArray {
        val image = BufferedImage(CARD_WIDTH, CARD_HEIGHT, BufferedImage.TYPE_INT_RGB)
        val graphics = image.createGraphics()
        try {
            initializeGraphics(graphics)
            drawBackCardforsaparate(graphics, hospital, patientWithImplants)
            return writeImageToByteArray(image)
        } finally {
            graphics.dispose()
        }
    }

    private fun generateBackImageWithDoctor(patientWithImplants: PatientWithTheirImplants, hospital: Hospital, doctor: Doctor?): ByteArray {
        val image = BufferedImage(CARD_WIDTH, CARD_HEIGHT, BufferedImage.TYPE_INT_RGB)
        val graphics = image.createGraphics()
        try {
            initializeGraphics(graphics)
            drawBackCardforsaparateWithDoctor(graphics, hospital, patientWithImplants, doctor)
            return writeImageToByteArray(image)
        } finally {
            graphics.dispose()
        }
    }

    private fun initializeGraphics(graphics: Graphics2D) {
        graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
        graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON)
        graphics.color = Color.decode("#F8F9FA")
        graphics.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)
    }

    private fun writeImageToByteArray(image: BufferedImage): ByteArray {
        val outputStream = ByteArrayOutputStream()
        ImageIO.write(image, "jpeg", outputStream)
        return outputStream.toByteArray()
    }



    private fun drawFrontCard(graphics: Graphics2D, hospital: Hospital, @Suppress("UNUSED_PARAMETER") patientWithImplants: PatientWithTheirImplants) {
        drawCardBackground(graphics, 0)
        drawHeaderSection(graphics, hospital, 0)
        drawWarningSection(graphics)
        drawFooter(graphics, hospital, 0)
    }

    private fun drawBackCardforsaparate(graphics: Graphics2D, hospital: Hospital, patientWithImplants: PatientWithTheirImplants) {
        drawCardBackground(graphics, 0)
        drawHeaderSection(graphics, hospital, 0)
        drawPatientInformation(graphics, patientWithImplants, 0)
        drawSignature(graphics, 0, hospital)
        // drawImagePlaceholders(graphics, 0, hospital)
        drawFooter2(graphics, hospital, 0)
    }

    private fun drawBackCardforsaparateWithDoctor(graphics: Graphics2D, hospital: Hospital, patientWithImplants: PatientWithTheirImplants, doctor: Doctor?) {
        drawCardBackground(graphics, 0)
        drawHeaderSection(graphics, hospital, 0)
        drawPatientInformation(graphics, patientWithImplants, 0)
        drawSignatureWithDoctor(graphics, 0, hospital, doctor)
        // drawImagePlaceholders(graphics, 0, hospital)
        drawFooter2(graphics, hospital, 0)
    }

    private fun drawBackCardWithDoctor(graphics: Graphics2D, hospital: Hospital, patientWithImplants: PatientWithTheirImplants, doctor: Doctor?) {
        val yOffset = CARD_HEIGHT + PADDING
        drawCardBackground(graphics, yOffset)
        drawHeaderSection(graphics, hospital, yOffset)
        drawPatientInformation(graphics, patientWithImplants, yOffset)
        drawSignatureWithDoctor(graphics, yOffset, hospital, doctor)
        // drawImagePlaceholders(graphics, yOffset, hospital)
        drawFooter2(graphics, hospital, yOffset)
    }
    private fun drawBackCard(graphics: Graphics2D, hospital: Hospital, patientWithImplants: PatientWithTheirImplants) {
        val yOffset = CARD_HEIGHT + PADDING
        drawCardBackground(graphics, yOffset)
        drawHeaderSection(graphics, hospital, yOffset)
        drawPatientInformation(graphics, patientWithImplants, yOffset)
        drawSignature(graphics, yOffset, hospital)
        // drawImagePlaceholders(graphics, yOffset, hospital)
        drawFooter2(graphics, hospital, yOffset)
    }
    private fun drawCardBackground(graphics: Graphics2D, yOffset: Int) {
        // Fill the background of the card
        graphics.color = Color.WHITE // Use white for the card background
        graphics.fillRoundRect(
            PADDING,
            yOffset + PADDING,
            CARD_WIDTH - 2 * PADDING,
            CARD_HEIGHT - 2 * PADDING,
            CORNER_RADIUS,
            CORNER_RADIUS
        )

        // Draw the border of the card
        graphics.color = Color.BLACK
        graphics.drawRoundRect(
            PADDING,
            yOffset + PADDING,
            CARD_WIDTH - 2 * PADDING,
            CARD_HEIGHT - 2 * PADDING,
            CORNER_RADIUS,
            CORNER_RADIUS
        )
    }


    private fun drawHospitalLogo(graphics: Graphics2D, hospital: Hospital, yOffset: Int) {
        val logoPath = hospital.logoHd
        try {
            val logo: BufferedImage = if (logoPath?.startsWith("http") == true) {
                ImageIO.read(URL(logoPath))
            } else {
                ImageIO.read(File(logoPath))
            }
            
            // Position logo on the right side
            val logoSize = 50
            val logoX = CARD_WIDTH - logoSize - PADDING * 2
            val logoY = yOffset
            graphics.drawImage(logo, logoX, logoY, logoSize, logoSize, null)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun drawHeaderSection(graphics: Graphics2D, hospital: Hospital, yOffset: Int) {
        // Draw header background - match card background for seamless look
        // graphics.color = Color.decode("#F8F9FA")
        // graphics.fillRect(
        //     PADDING + 1,  // Start 1px inside the border
        //     yOffset + PADDING + 1,  // Start 1px inside the border
        //     CARD_WIDTH - 2 * PADDING - 2,  // Width minus 2px for borders
        //     PADDING * 3 - 2  // Height minus 2px for borders
        // )
        
        // No border - seamless integration with card background
        
        // Draw logo on the left
        drawLogo(graphics, hospital, yOffset)
        
        // Draw title image on the right
        drawTitleImage(graphics, yOffset)
    }
    
    private fun drawLogo(graphics: Graphics2D, hospital: Hospital, yOffset: Int) {
        val rightLogoPath = hospital.logoHd

        try {
            val rightLogo: BufferedImage = if (rightLogoPath?.startsWith("http") == true) {
                ImageIO.read(URL(rightLogoPath))
            } else {
                ImageIO.read(File(rightLogoPath))
            }

            val aspectRatio = rightLogo.width.toFloat() / rightLogo.height.toFloat()
            val logoSize = 70 
            val logoWidth = logoSize
            val logoHeight = (logoSize / aspectRatio).toInt()
            
            val logoX = PADDING * 2
            val logoY = yOffset + PADDING + (PADDING * 3 - logoHeight) / 2 + TOP_LOGO_PADDING 
            
            graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR)
            graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY)
            
            graphics.drawImage(rightLogo, logoX, logoY, logoWidth, logoHeight, null)

        } catch (e: Exception) {
            e.printStackTrace()
            graphics.color = Color.decode("#0D9488")
            graphics.font = Font("Arial", Font.BOLD, 12)
            graphics.drawString("MEDICAL CLINIC", PADDING * 2, yOffset + PADDING * 2)
        }
    }
    
    private fun drawTitleImage(graphics: Graphics2D, yOffset: Int) {
        try {
            val resourceStream = this::class.java.classLoader.getResourceAsStream("img/patient_implant.jpg")
            val titleImage = resourceStream?.let { ImageIO.read(it) }
            
            if (titleImage != null) {
                val aspectRatio = titleImage.width.toFloat() / titleImage.height.toFloat()
                val titleHeight = PADDING * 3 
                val titleWidth = (titleHeight * aspectRatio).toInt()
                
                val titleX = CARD_WIDTH - titleWidth - PADDING * 2
                val titleY = yOffset + PADDING + (PADDING * 3 - titleHeight) / 2 + TOP_LOGO_PADDING 
                
                graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR)
                graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY)
                
                graphics.drawImage(titleImage, titleX, titleY, titleWidth, titleHeight, null)
            } else {
                // Fallback text
                graphics.color = Color.BLACK
                graphics.font = Font("Arial", Font.BOLD, 14)
                graphics.drawString("PATIENT IMPLANT ID CARD", CARD_WIDTH - 200, yOffset + PADDING * 2)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            // Fallback text
            graphics.color = Color.BLACK
            graphics.font = Font("Arial", Font.BOLD, 14)
            graphics.drawString("PATIENT IMPLANT ID CARD", CARD_WIDTH - 200, yOffset + PADDING * 2)
        }
    }


    private fun drawWarningSection(graphics: Graphics2D) {
        // Full width warning section with better positioning
        graphics.color = Color.decode("#0D9488")
        val warningWidth = CARD_WIDTH - 2 * PADDING
        val warningHeight = 80
        val warningY = PADDING * 5 // Position below header
        
        graphics.fillRoundRect(
            PADDING,
            warningY,
            warningWidth,
            warningHeight,
            CORNER_RADIUS,
            CORNER_RADIUS
        )

        // Warning text
        graphics.color = Color.WHITE
        graphics.font = Font("Arial", Font.BOLD, 15)
        drawWrappedText(
            graphics,
            "The person has a metal implant in their body, which could potentially trigger a metal detection device",
            PADDING * 2,
            warningY + PADDING,
            warningWidth - PADDING * 2
        )
    }






    private fun drawPatientInformation(graphics: Graphics2D, patientWithImplants: PatientWithTheirImplants, yOffset: Int) {
        graphics.color = Color.BLACK
        graphics.font = Font("Arial", Font.BOLD, 14)

        val leftPadding = PADDING * 3 
        val rightPadding = PADDING * 2 // Right padding for the text
        val contentWidth = CARD_WIDTH - leftPadding - rightPadding // Total available space for the text

        var y = yOffset + PADDING * 6 

        val patientImplantInfoList = patientWithImplants.patientImplantInfoList
        val details = listOf(
            "Patient Name: ${patientWithImplants.patient?.patientName ?: "Unknown"}",
            "Registration Number: ${patientWithImplants.patient?.patientId ?: "N/A"}",
            "Operation Date: ${patientImplantInfoList?.firstOrNull()?.operationDate ?: "N/A"}",
            "Operation Side: ${patientImplantInfoList?.firstOrNull()?.operationSide}     Age: ${patientWithImplants.patient?.age}     Gender: ${patientWithImplants.patient?.gender}",
            "Implant Name: ${patientImplantInfoList?.joinToString(", ") { it.implantName.toString() }}"
        )

        details.forEach { detail ->
            // Measure the width of the detail text
            val stringWidth = graphics.fontMetrics.stringWidth(detail)
            
            // Adjust content for justified alignment
            if (stringWidth < contentWidth) {
                drawJustifiedText(graphics, detail, leftPadding, y, contentWidth)
            } else {
                // If the text is too long, consider wrapping or handling overflow (optional)
                drawWrappedText(graphics, detail, leftPadding, y, contentWidth)
            }

            y += PADDING
        }
    }

    private fun drawJustifiedText(graphics: Graphics2D, text: String, x: Int, y: Int, maxWidth: Int) {
        val words = text.split(" ")
        var currentLine = StringBuilder()
        var currentY = y

        val metrics = graphics.fontMetrics
        var spaceBetweenWords: Int
        var totalWidth: Int

        // Build lines of justified text
        words.forEach { word ->
            val testLine = if (currentLine.isEmpty()) word else "${currentLine} $word"
            totalWidth = metrics.stringWidth(testLine)

            if (totalWidth <= maxWidth) {
                currentLine.append(" ").append(word)
            } else {
                spaceBetweenWords = (maxWidth - metrics.stringWidth(currentLine.toString().trim())) / (currentLine.toString().split(" ").size - 1)
                var line = currentLine.toString().trim().replace(" ".toRegex(), " ".repeat(spaceBetweenWords))
                graphics.drawString(line, x, currentY)
                currentY += metrics.height
                currentLine = StringBuilder(word) // Start a new line
            }
        }

        if (currentLine.isNotEmpty()) {
            graphics.drawString(currentLine.toString(), x, currentY)
        }
    }

    private fun drawSignature(graphics: Graphics2D, yOffset: Int, hospital: Hospital) {
        val signatureY = yOffset + CARD_HEIGHT - PADDING * 4 

        // Fetching the image from the hospital API
        val authImageUrl = hospital.signature // Assuming there's a field in hospital API for the signature image URL
        var authImage: BufferedImage
        try {
            authImage = authImageUrl?.let { fetchImage(it) }!! // Fetching the image from the URL
        } catch (e: Exception) {
            e.printStackTrace()
            // If the image fails to load, fallback to a placeholder image
            authImage = BufferedImage(100, 50, BufferedImage.TYPE_INT_ARGB)
            val g2d = authImage.createGraphics()
            g2d.color = Color.GRAY
            g2d.fillRect(0, 0, 100, 50) // Drawing a placeholder box
            g2d.dispose()
        }

        // Define padding and adjusted dimensions for the image
        val paddingLeft = 20 // Add left padding
        val imageWidth = 60  // Reduced image width
        val imageHeight = 30 // Reduced image height

        // Calculate the position for the image (aligned closely to the signature line)
        val imageX = CARD_WIDTH - 150 + paddingLeft // Adjusted X position with padding
        val imageY = signatureY - imageHeight // Image directly above the signature line

        // Draw the image with adjusted dimensions
        graphics.drawImage(authImage, imageX, imageY, imageWidth, imageHeight, null)

        // Signature line (closer to the image)
        graphics.color = Color.LIGHT_GRAY
        graphics.drawLine(
            CARD_WIDTH - 150,
            signatureY - 5, // Shift upward closer to the image
            CARD_WIDTH - PADDING * 2,
            signatureY - 5
        )

        // Auth. Sign text (aligned closely to the line)
        graphics.color = Color.BLACK
        graphics.font = Font("Arial", Font.PLAIN, 12)
        graphics.drawString("Auth. Sign", CARD_WIDTH - 120, signatureY + PADDING - 10) 
    }

    private fun drawSignatureWithDoctor(graphics: Graphics2D, yOffset: Int, hospital: Hospital, doctor: Doctor?) {
        val signatureY = yOffset + CARD_HEIGHT - PADDING * 4 

        // Determine which signature to use: doctor signature if available, otherwise hospital signature
        val signatureUrl = doctor?.signatureUrl ?: hospital.signature
        var authImage: BufferedImage
        
        try {
            authImage = signatureUrl?.let { fetchImage(it) } ?: createPlaceholderImage()
        } catch (e: Exception) {
            e.printStackTrace()
            authImage = createPlaceholderImage()
        }

        // Define padding and adjusted dimensions for the image
        val paddingLeft = 20 // Add left padding
        val imageWidth = 60  // Reduced image width
        val imageHeight = 30 // Reduced image height

        // Calculate the position for the image (aligned closely to the signature line)
        val imageX = CARD_WIDTH - 150 + paddingLeft // Adjusted X position with padding
        val imageY = signatureY - imageHeight // Image directly above the signature line

        // Draw the image with adjusted dimensions
        graphics.drawImage(authImage, imageX, imageY, imageWidth, imageHeight, null)

        // Signature line (closer to the image)
        graphics.color = Color.LIGHT_GRAY
        graphics.drawLine(
            CARD_WIDTH - 150,
            signatureY - 5, // Shift upward closer to the image
            CARD_WIDTH - PADDING * 2,
            signatureY - 5
        )

        // Auth. Sign text (aligned closely to the line)
        graphics.color = Color.BLACK
        graphics.font = Font("Arial", Font.PLAIN, 12)
        
        // Display doctor name if doctor is provided, otherwise show "Auth. Sign"
        val signatureText = if (doctor != null) {
            doctor.doctorName ?: "Auth. Sign"
        } else {
            "Auth. Sign"
        }
        
        val metrics = graphics.fontMetrics
        val textWidth = metrics.stringWidth(signatureText)
        
        val maxTextX = CARD_WIDTH - PADDING * 2
        
        val textX = if (CARD_WIDTH - 120 + textWidth > maxTextX) {
            maxTextX - textWidth
        } else {
            CARD_WIDTH - 120
        }

        graphics.drawString(signatureText, textX, signatureY + PADDING - 10)
    }

    private fun createPlaceholderImage(): BufferedImage {
        val placeholder = BufferedImage(100, 50, BufferedImage.TYPE_INT_ARGB)
        val g2d = placeholder.createGraphics()
        g2d.color = Color.GRAY
        g2d.fillRect(0, 0, 100, 50) // Drawing a placeholder box
        g2d.dispose()
        return placeholder
    }


    // this is bottom logo part fun including background color

    // private fun drawImagePlaceholders(graphics: Graphics2D, yOffset: Int, hospital: Hospital) {
    //     // Set the background color to gray
    //     graphics.color = Color.LIGHT_GRAY
    //     val rowY = yOffset + CARD_HEIGHT - PADDING * 6 // Y-coordinate for the row
    //     graphics.fillRect(PADDING + 1, rowY, CARD_WIDTH - 2 * PADDING - 1, 100) // Full row width, height of 100

    //     // Placeholder dimensions
    //     val placeholderWidth = 100
    //     val placeholderHeight = 60
    //     val spaceWidth = (CARD_WIDTH - 2 * PADDING - 2 * placeholderWidth) / 3 // Calculate spaces between placeholders

    //     // Static image placeholder removed (redundant "PATIENT IMPLANT ID CARD" icon)

    //     // // Draw dynamic image placeholder
    //     val dynamicImageX = PADDING + spaceWidth
    //     try {
    //         val dynamicImageUrl = hospital.logoFt
    //         val dynamicImage = dynamicImageUrl?.let { fetchImage(it) }
    //         if (dynamicImage != null) {
    //             graphics.drawImage(dynamicImage, dynamicImageX, rowY + 10, placeholderWidth, placeholderHeight, null)
    //         } else {
    //             graphics.color = Color.RED
    //             graphics.fillRect(dynamicImageX, rowY + 10, placeholderWidth, placeholderHeight)
    //         }
    //      } catch (e: Exception) {
    //          e.printStackTrace()
    //           graphics.color = Color.RED
    //           graphics.fillRect(dynamicImageX, rowY + 10, placeholderWidth, placeholderHeight)
    //      }
    // }


    private fun drawFooter(graphics: Graphics2D, hospital: Hospital, yOffset: Int) {
        // Simple footer design
        val footerHeight = PADDING * 6
        val footerY = yOffset + CARD_HEIGHT - footerHeight
        val marginBottom = PADDING

        // Simple footer background
        // graphics.color = Color.WHITE
        // graphics.fillRect(
        //     PADDING + 3,
        //     footerY,
        //     CARD_WIDTH / 2,
        //     footerHeight - marginBottom
        // )

        // Simple text
        graphics.color = Color.decode("#00008B")
        graphics.font = Font("Arial", Font.BOLD, 12)

        val leftTextY = footerY + PADDING
        graphics.drawString("Contact No: ${hospital.contactNumber ?: "NA"}", PADDING * 3, leftTextY)
        graphics.drawString("Website: ${hospital.websiteAddress ?: "NA"}", PADDING * 3, leftTextY + PADDING)
        
        // Simple contact info
        graphics.drawString("Toll Free: 1800-123-4567", PADDING * 3, leftTextY + PADDING * 2)
        graphics.drawString("Landline: 0231 6622555", PADDING * 3, leftTextY + PADDING * 3)

        // Right section - Dynamic image from hospital (right half)
        // val imageUrl = hospital.logoFt
        // try {
        //     val hospitalImage: BufferedImage = imageUrl?.let { fetchImage(it) }!!

        //     // Set image width to cover the entire right half of the footer
        //     val imageWidth = CARD_WIDTH / 2 - 50 // Image should cover half the width
        //     val imageHeight = footerHeight - marginBottom // Image height adjusted to fit the row

        //     // Image position
        //     val imageX = CARD_WIDTH / 2 + PADDING // Right half, add padding on the X-axis
        //     val imageY = footerY + (footerHeight - marginBottom - imageHeight) / 2 // Center the image vertically

        //     // Draw the image
        //     graphics.drawImage(hospitalImage, imageX, imageY, imageWidth, imageHeight, null)
        // } catch (e: Exception) {
        //     e.printStackTrace()
        //     // Fallback: Placeholder for the image
        //     val placeholderHeight = footerHeight - marginBottom // Adjust placeholder height
        //     val placeholderWidth = placeholderHeight * 3 / 2 // Assuming a 3:2 aspect ratio
        //     val placeholderX = CARD_WIDTH / 2 + PADDING // Right half, add some padding on the X-axis
        //     val placeholderY = footerY + (footerHeight - marginBottom - placeholderHeight) / 2

        //     graphics.color = Color.LIGHT_GRAY
        //     graphics.fillRect(placeholderX, placeholderY, placeholderWidth, placeholderHeight)
        //     graphics.color = Color.RED
        //     graphics.drawString("No Image", placeholderX + 10, placeholderY + placeholderHeight / 2)
        // }
    }



    private fun drawFooter2(graphics: Graphics2D, hospital: Hospital, yOffset: Int) {
        // Footer dimensions
        val footerHeight = 30 // Reduced height for the footer
        val footerY = yOffset + CARD_HEIGHT - footerHeight - PADDING
        val footerX = PADDING + 1
        val footerWidth = CARD_WIDTH - PADDING * 2 - 1

        // Footer background with sharp upper corners and rounded lower corners
        graphics.color = if (yOffset == 0) Color.decode("#1F2937") else Color.decode("#0D9488")

        // Rounded bottom corners
        graphics.fillRoundRect(
            footerX,                              // X position
            footerY,                              // Y position
            footerWidth,                          // Width
            footerHeight,                         // Height
            CORNER_RADIUS,                        // Arc width
            CORNER_RADIUS                         // Arc height
        )

        // Overlay a rectangle on the top to create sharp upper corners
        graphics.fillRect(
            footerX,                              // X position
            footerY,                              // Y position
            footerWidth,                          // Width
            footerHeight - CORNER_RADIUS          // Height to cover the rounded top
        )

        // Footer text
        graphics.color = Color.WHITE
        graphics.font = Font("Arial", Font.BOLD, 14)

        // Get the contact number and website address
        val contactText = hospital.contactNumber ?: "NA"
        val websiteText = hospital.websiteAddress ?: "NA"

        // Calculate the width of the entire text including separator "|"
        val separator = " | "
        val totalText = "$contactText$separator$websiteText"

        val totalWidth = graphics.fontMetrics.stringWidth(totalText)

        // Calculate the starting X position to center the text
        val startX = (CARD_WIDTH - totalWidth) / 2

        // Draw the combined text (contact number | website address)
        graphics.drawString(totalText, startX, footerY + footerHeight / 2 + 4) // Vertically centered
    }






    private fun drawWrappedText(graphics: Graphics2D, text: String, x: Int, y: Int, maxWidth: Int) {
        val words = text.split(" ")
        var currentLine = StringBuilder()
        var currentY = y

        val metrics = graphics.fontMetrics

        words.forEach { word ->
            val testLine = if (currentLine.isEmpty()) word else "${currentLine} $word"
            val testWidth = metrics.stringWidth(testLine)

            if (testWidth > maxWidth) {
                graphics.drawString(currentLine.toString(), x, currentY)
                currentY += metrics.height
                currentLine = StringBuilder(word)
            } else {
                if (currentLine.isNotEmpty()) currentLine.append(" ")
                currentLine.append(word)
            }
        }

        if (currentLine.isNotEmpty()) {
            graphics.drawString(currentLine.toString(), x, currentY)
        }
    }

    private fun fetchImage(url: String): BufferedImage {
        val restTemplate = RestTemplate()
        val imageBytes = restTemplate.getForObject(url, ByteArray::class.java)
            ?: throw RuntimeException("Failed to fetch image from $url")
        return ImageIO.read(ByteArrayInputStream(imageBytes))
    }
}
