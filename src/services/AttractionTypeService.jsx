import axios from 'axios';
import baseURL from '@api/baseURL'
import { getCookie } from '@services/AuthenService';
const token = getCookie('token');

export const fetchAttractionType = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/attraction-types`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.data.map(item => ({
            attractionTypeId: item.attractionCategoryId,
            attractionTypeName: item.name,
            description: item.description
        }));
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};