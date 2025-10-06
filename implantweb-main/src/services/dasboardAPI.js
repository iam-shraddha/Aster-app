import axios from 'axios';
import BASE_URL from '../services/Config';

// Base URL for the APIs
// const BASE_URL = 'http://ec2-13-235-8-185.ap-south-1.compute.amazonaws.com:8080/implant-print-history';

/**
 * Adds a new implant print history record.
 * @param {Object} data - The request body data.
 * @param {number} data.hospitalId - The ID of the hospital.
 * @param {string} data.patientId - The patient ID.
 * @param {string} data.printDate - The print date in ISO format.
 * @returns {Promise<Object>} - The API response.
 */
export const addImplantPrintHistory = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/implant-print-history/add`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding implant print history:', error);
    throw error;
  }
};

/**
 * Fetches implant print history records by hospital ID.
 * @param {number} hospitalId - The ID of the hospital.
 * @returns {Promise<Object[]>} - The API response.
 */
export const getImplantPrintHistoryByHospital = async (hospitalId) => {
  try {
    const response = await axios.get(`${BASE_URL}/implant-print-history/by-hospital/${hospitalId}`);
    const printHistory = response.data;

    // Count the number of records
    const numberOfPrints = printHistory.length;
    console.log('Number of print records:', numberOfPrints);

    return { printHistory, numberOfPrints };
  } catch (error) {
    console.error('Error fetching implant print history:', error);
    throw error;
  }
};
