import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const fetchTourDuration = async (nameSearch = '') => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/tour-durations`, {
            params: {
                nameSearch: nameSearch
            },
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

export const createTourDuration = async (durationData) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/tour-durations`, {
            durationName: durationData.name,
            numberOfDay: parseInt(durationData.days)
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating tour duration:', error);
        throw error;
    }
};

export const deleteTourDuration = async (durationId) => {
    const token = getCookie('token');
    try {
        const response = await axios.delete(`${baseURL}/api/tour-durations/${durationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting tour duration:', error);
        throw error;
    }
};