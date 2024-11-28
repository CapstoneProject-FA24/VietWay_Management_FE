import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const fetchPostCategory = async (nameSearch = '') => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/post-categories`, {
            params: {
                nameSearch: nameSearch
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.data.map(item => ({
            postCategoryId: item.postCategoryId,
            name: item.name,
            description: item.description,
            createdAt: item.createdAt
        }));
    } catch (error) {
        console.error('Error fetching tour categories:', error);
        throw error;
    }
};


export const createPostCategory = async (categoryData) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/post-categories`, {
            name: categoryData.name,
            description: categoryData.description
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating post category:', error);
        throw error;
    }
};

export const deletePostCategory = async (postCategoryId) => {
    const token = getCookie('token');
    try {
        const response = await axios.delete(`${baseURL}/api/post-categories/${postCategoryId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting post category:', error);
        throw error;
    }
};
