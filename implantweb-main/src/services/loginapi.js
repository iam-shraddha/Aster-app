import axios from 'axios';
import BASE_URL from './Config';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email,
            password,
        });
        return response.data; // Return the API response
    } catch (error) {
        console.error('Login error:', error);
        throw error; // Throw the error to be handled in the component
    }
};
