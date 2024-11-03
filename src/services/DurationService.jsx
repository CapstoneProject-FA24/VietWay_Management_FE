import axios from 'axios';
import baseURL from '@api/baseURL'

export const fetchTourDuration = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/TourDuration`);
        console.log('Tour Duration API response:', response.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching tour durations:', error);
        throw error;
    }
};