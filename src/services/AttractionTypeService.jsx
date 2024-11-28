import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const fetchAttractionType = async (nameSearch = '') => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/attraction-types`, {
            params: {
                nameSearch: nameSearch
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.data.map(item => ({
            attractionTypeId: item.attractionCategoryId,
            attractionTypeName: item.name,
            description: item.description,
            createdAt: item.createdAt
        }));
    } catch (error) {
        console.error('Error fetching attraction types:', error);
        throw error;
    }
};

export const createAttractionType = async (attractionData) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/attraction-types`, {
            attractionTypeName: attractionData.name,
            description: attractionData.description
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating attraction type:', error);
        throw error;
    }
};

export const deleteAttractionType = async (attractionTypeId) => {
    const token = getCookie('token');
    try {
        const response = await axios.delete(`${baseURL}/api/attraction-types/${attractionTypeId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting attraction type:', error);
        throw error;
    }
};