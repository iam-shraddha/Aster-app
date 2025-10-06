import axios from 'axios';
import BASE_URL from './Config'; // Ensure this contains the base URL for your API
import { useEffect, useState } from 'react';

// Generic GET request
export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Login request
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

// Fetch patients by hospital
export const fetchPatientsByHospital = async (hospitalId, pageSize) => {
  try {
    const endpoint = `/patientImplantInfo/getPatientsByHospital/${hospitalId}?page=0&size=${pageSize}&sort=patientName,asc`;
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    const data = response.data;

    // Process the patient data
    const patients = data.content.map(patientData => {
      const implantInfoList = patientData.patientImplantInfoList || [];
      const implants = implantInfoList.map(implant => ({
        implantName: implant.implantName || 'Unknown Implant',
        operationDate: implant.dateOfSurgery || 'Unknown Date',
        operationSide: implant.operationSide || 'Unknown Side',
      }));

      return {
        id: patientData.patient.patientId,
        registrationNumber: patientData.patient.registrationNumber || patientData.patient.patientId, // Derive or fetch this
        patientName: patientData.patient.patientName,
        age: patientData.patient.age,
        gender: patientData.patient.gender,
        hospitalId: patientData.patient.hospitalId,
        implants,
        implantTypes: implants.map(implant => implant.implantName),
        operationDate: implants.map(implant => implant.operationDate).join(', '), // Combine dates for display
        operationSide: implants.map(implant => implant.operationSide).join(', '), // Combine sides for display
      };
    });

    return patients;
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    throw error;
  }
};


// Add a new patient
export const addPatient = async (patientDetails, hospitalId) => {
  // Map gender to the required format
  let mappedGender = "O"; // Default to "O" for other or invalid input
  if (patientDetails.gender.toLowerCase() === "male") {
    mappedGender = "M";
  } else if (patientDetails.gender.toLowerCase() === "female") {
    mappedGender = "F";
  }

  // Prepare the request body
  const requestBody = {
    patientId: patientDetails.registrationNumber,
    implantId: 1, // Example implant ID
    patientName: patientDetails.patientName,
    gender: mappedGender,
    age: patientDetails.age,
    hospitalId: hospitalId,
  };

  try {
    const response = await axios.post(`${BASE_URL}/patients/addNewPatients`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Uncomment if authentication is required
      },
    });

    console.log('Add patient response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error adding patient:', error);
    throw error;
  }
};


export const submitPatientImplantInfo = async (patientDetails) => {
  if (!patientDetails) {
    console.error("patientDetails is not defined.");
    throw new Error("Please select a patient before submitting implant info.");
  }

  if (!Array.isArray(patientDetails.implantTypes) || patientDetails.implantTypes.length === 0) {
    console.error("No implants selected.");
    throw new Error("Please select at least one implant before submitting.");
  }

  try {
    // Construct payload
    const payload = patientDetails.implantTypes.map((implantType, index) => ({
      patientId: patientDetails.patientId,
      implantId: index + 1,
      implantName: implantType,
      operationSide: patientDetails.operationSide,
      operationDate: patientDetails.operationDate,
      isActive: true,
    }));

    console.log("Submitting implant info payload:", payload);


    const response = await axios.post(
      `${BASE_URL}/patientImplantInfo/savePatientImplantInfoForPatient`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting implant info:", error);
    throw new Error("Failed to submit implant information. Please try again.");
  }
};



// Fetch patient implant PDF
export const fetchPdf = async (registrationNumber, hospitalId) => {
  try {
    if (!registrationNumber || !hospitalId) {
      throw new Error('Invalid parameters: patientId and hospitalId are required.');
    }
    const response = await axios.get(
      `${BASE_URL}/patientImplantInfo/generatePdf/${registrationNumber}/${hospitalId}`,
      {
        responseType: 'blob', // To handle the PDF file response
      }
    );

    return URL.createObjectURL(new Blob([response.data]));
  } catch (error) {
    console.error("Error fetching PDF:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch the PDF. Please try again."
    );
  }
};


//fetch patient implant PDF
export const fetchPatientPdf = async (registrationNumber, hospitalId) => {
  if (!registrationNumber || !hospitalId) {
    console.error("Missing credentials: patientId or hospitalId is undefined.");
    console.log("Provided values:", { registrationNumber, hospitalId });
    throw new Error('Invalid parameters: Both patientId and hospitalId are required.');
  }
  try {
    const pdfUrl = `${BASE_URL}/patientImplantInfo/generatePdf/${registrationNumber}/${hospitalId}`;

    const response = await fetch(pdfUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the PDF');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error fetching the PDF:', error);
    throw error;
  }
};

//fetch patient implant PDF
export const fetchImplantPdfforPreview = async (registrationNumber, hospitalId) => {
  if (!registrationNumber || !hospitalId) {
    console.error("Missing credentials: patientId or hospitalId is undefined.");
    console.log("Provided values:", { registrationNumber, hospitalId });
    throw new Error('Invalid parameters: Both patientId and hospitalId are required.');
  }
  try {
    const pdfUrl = `${BASE_URL}/patientImplantInfo/generateCombinedCardsPdf/${registrationNumber}/${hospitalId}`;

    const response = await fetch(pdfUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch combine the PDF');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error fetching the combine PDF:', error);
    throw error;
  }
};



//fetch all implants
export const fetchAllImplants = async () => {
  try {

    console.log('Fetching implant options...');
    const response = await fetch(`${BASE_URL}/implantInfo/getImplantInfoByCompany`);

    console.log('Response received:', response);

    if (!response.ok) {
      throw new Error('Failed to fetch implant data');
    }

    const data = await response.json();
    console.log('Fetched data:', data);

    if (!Array.isArray(data)) {
      throw new Error('Unexpected data format, expected an array');
    }

    return data.map((implant) => implant.implantName);
  } catch (error) {
    console.error('Error fetching implants:', error);
    throw error;
  }
};


export const fetchAllImplantsforid = async () => {
  try {
    const response = await fetch(`${BASE_URL}/implantInfo/getAllImplantInfo`);

    if (!response.ok) {
      throw new Error('Failed to fetch implant data');
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Unexpected data format, expected an array');
    }

    const implantMap = data.reduce((map, implant) => {
      if (implant.implantName && implant.implantId) {
        map[implant.implantName] = implant.implantId;
      }
      return map;
    }, {});

    console.log('Generated implant map:', implantMap);
    return implantMap;
  } catch (error) {
    console.error('Error fetching implants:', error);
    throw error;
  }
};


// Function to fetch the first image
export const fetchImage1 = async (registrationNumber, hospitalId) => {
  try {
    if (!registrationNumber || !hospitalId) {
      throw new Error('Invalid parameters: registrationNumber and hospitalId are required.');
    }

    const response = await axios.get(
      `${BASE_URL}/patientImplantInfo/generateImage1/${registrationNumber}/${hospitalId}`,
      {
        responseType: 'blob', // Handle the image file response
      }
    );

    return URL.createObjectURL(new Blob([response.data])); // Create a URL for the image
  } catch (error) {
    console.error("Error fetching Image 1:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch Image 1. Please try again."
    );
  }
};

// Function to fetch the second image
export const fetchImage2 = async (registrationNumber, hospitalId) => {
  try {
    if (!registrationNumber || !hospitalId) {
      throw new Error('Invalid parameters: registrationNumber and hospitalId are required.');
    }

    const response = await axios.get(
      `${BASE_URL}/patientImplantInfo/generateImage2/${registrationNumber}/${hospitalId}`,
      {
        responseType: 'blob', // Handle the image file response
      }
    );

    return URL.createObjectURL(new Blob([response.data])); // Create a URL for the image
  } catch (error) {
    console.error("Error fetching Image 2:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch Image 2. Please try again."
    );
  }
};

// React component: Fetch and display images
export const useFetchImages = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const fetchImages = async (registrationNumber, hospitalId) => {
    if (!registrationNumber || !hospitalId) return;

    try {
      // Fetch Image 1 and Image 2
      const fetchedImage1 = await fetchImage1(registrationNumber, hospitalId);
      const fetchedImage2 = await fetchImage2(registrationNumber, hospitalId);

      // Set the fetched images to state
      setImage1(fetchedImage1);
      setImage2(fetchedImage2);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return { image1, image2, fetchImages };
};
