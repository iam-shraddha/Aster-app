import java.io.Serializable

class PatientImplantInfoSearchKey() : Serializable {

    var patientId : String ?= null
    var implantId : Integer ?= null
    var operationDate: String?= null

    constructor(patientId: String?, implantId: Integer?, operationDate: String?):this() {
        this.patientId = patientId
        this.implantId = implantId
        this.operationDate = operationDate
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PatientImplantInfoSearchKey

        if (patientId != other.patientId) return false
        if (implantId != other.implantId) return false
        if (operationDate != other.operationDate) return false

        return true
    }

    override fun hashCode(): Int {
        var result = patientId?.hashCode() ?: 0
        result = 31 * result + (implantId?.hashCode() ?: 0)
        result = 31 * result + (operationDate?.hashCode() ?: 0)
        return result
    }
}