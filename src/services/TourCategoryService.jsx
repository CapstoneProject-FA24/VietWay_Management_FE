import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const fetchTourCategory = async (nameSearch = '') => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/tour-categories`, {
            params: {
                nameSearch: nameSearch
            },
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
        console.error('Error fetching tour categories:', error);
        throw error;
    }
};


export const createTourCategory = async (categoryData) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/tour-categories`, {
            name: categoryData.name,
            description: categoryData.description
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating tour category:', error);
        throw error;
    }
};
