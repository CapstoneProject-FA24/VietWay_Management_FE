import axios from 'axios';
import baseURL from '@api/baseURL'

export const fetchPostCategory = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/post-categories`);
        return response.data.data.map(item => ({
            postCategoryId: item.postCategoryId,
            name: item.name,
            description: item.description,
            createdAt: item.createdAt
        }));
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};