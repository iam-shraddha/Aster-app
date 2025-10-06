import axios from 'axios';
import BASE_URL from './Config';

// Function to submit patient implant information
export const submitPatientImplantInfo = async (patientData) => {
  const { patientId, implantTypes, operationSide, operationDate } = patientData;

  // Prepare the request body
  const implantInfoList = implantTypes.map((implantName, index) => ({
    patientId,
    implantId: index + 1, // Generate a unique implantId (replace with backend logic if needed)
    implantName,
    operationSide,
    operationDate,
  }));

  const payload = { implantInfoList };

  try {
    const response = await axios.post(
      `${BASE_URL}/patientImplantInfo/addNewPatientImplantInfo`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the response data if successful
  } catch (error) {
    console.error("Error adding new patient implant info:", error);
    throw error; // Re-throw the error to handle it in the caller
  }
};
