import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const fetchTourCategory = async () => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/tour-categories`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.data.map(item => ({
            tourCategoryId: item.tourCategoryId,
            tourCategoryName: item.name,
            description: item.description,
            createdAt: item.createdAt
        }));
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};