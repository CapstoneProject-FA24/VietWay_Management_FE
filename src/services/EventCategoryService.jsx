import axios from 'axios';
import baseURL from '@api/baseURL'

export const fetchEventCategory = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/event-categories`);
        return response.data.data.map(item => ({
            eventCategoryId: item.eventCategoryId,
            name: item.name,
            description: item.description,
            createdAt: item.createdAt
        }));
    } catch (error) {
        console.error('Error fetching event categories:', error);
        throw error;
    }
};