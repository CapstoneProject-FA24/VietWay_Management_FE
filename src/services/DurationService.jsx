import axios from 'axios';
import baseURL from '@api/baseURL'

export const fetchTourDuration = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/TourDuration`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};