import axios from 'axios';
import baseURL from '@api/baseURL'

export const fetchPostCategory = async () => {
    try {
        //const response = await axios.get(`${baseURL}/api/TourCategory`);
        const response = await axios.get(`https://localhost:7092/api/post-category`);
        return response.data.data.map(item => ({
            postCategoryId: item.postCategoryId,
            name: item.name,
            description: item.description
        }));
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};