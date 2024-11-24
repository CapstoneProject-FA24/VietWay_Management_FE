import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const fetchTourDuration = async () => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/tour-durations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
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