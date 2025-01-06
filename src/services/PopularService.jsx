import axios from 'axios';
import { getCookie } from '@services/AuthenService';

const baseURL = import.meta.env.VITE_API_URL;

export const fetchPopularProvinces = async (categoryId = null, categoryType = null) => {
    const token = getCookie('token');
    try {
        let url = `${baseURL}/api/popular/provinces`;
        
        if (categoryId && categoryType) {
            url += `?categoryId=${categoryId}&categoryType=${categoryType}`;
        }

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data?.data;

        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid response structure: data not found or not an array');
        }

        return data.map(item => ({
            provinceId: item.provinceId
        }));

    } catch (error) {
        console.error('Error fetching popular provinces:', error);
        throw error;
    }
};

export const fetchPopularAttractionCategories = async () => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/popular/attraction-categories`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data?.data;

        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid response structure: data not found or not an array');
        }

        return data.map(item => ({
            attractionCategoryId: item.attractionCategoryId
        }));

    } catch (error) {
        console.error('Error fetching popular attraction categories:', error);
        throw error;
    }
};

export const fetchPopularPostCategories = async () => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/popular/post-categories`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data?.data;

        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid response structure: data not found or not an array');
        }

        return data.map(item => ({
            postCategoryId: item.postCategoryId
        }));

    } catch (error) {
        console.error('Error fetching popular post categories:', error);
        throw error;
    }
};

export const fetchPopularTourCategories = async () => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/popular/tour-categories`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data?.data;

        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid response structure: data not found or not an array');
        }

        return data.map(item => ({
            tourCategoryId: item.tourCategoryId
        }));

    } catch (error) {
        console.error('Error fetching popular tour categories:', error);
        throw error;
    }
};
