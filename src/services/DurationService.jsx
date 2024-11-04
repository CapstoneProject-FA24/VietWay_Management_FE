import axios from 'axios';
import baseURL from '@api/baseURL'

export const fetchTourDuration = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/tour-durations`);
        return response.data.data.map(item => ({
            durationId: item.durationId,
            durationName: item.durationName,
            dayNumber: item.numberOfDay,
            createdAt: item.createdAt
        }));
    } catch (error) {
        console.error('Error fetching tour durations:', error);
        throw error;
    }
};