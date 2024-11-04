import axios from 'axios';
import baseURL from '@api/baseURL'

export const fetchTourCategory = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/tour-categories`);
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