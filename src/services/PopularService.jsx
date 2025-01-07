import axios from 'axios';
import { getCookie } from '@services/AuthenService';

const baseURL = import.meta.env.VITE_API_URL;

export const fetchPopularProvinces = async (categoryId = null, categoryType = null) => {
    const token = getCookie('token');
    const queryParams = new URLSearchParams();
    if (categoryType == 0) queryParams.append('attractionCategory', categoryId);
    if (categoryType == 1) queryParams.append('tourCategory', categoryId);
    if (categoryType == 2) queryParams.append('postCategory', categoryId);
    try {
        const response = await axios.get(`${baseURL}/api/popular/provinces?${queryParams.toString()}`, {
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

export const fetchPopularAttractionCategories = async (provinceId) => {
    const token = getCookie('token');
    const queryParams = new URLSearchParams();
    if (provinceId) queryParams.append('provinceId', provinceId);
    try {
        const response = await axios.get(`${baseURL}/api/popular/attraction-categories?${queryParams.toString()}`, {
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

export const fetchPopularPostCategories = async (provinceId) => {
    const token = getCookie('token');
    const queryParams = new URLSearchParams();
    if (provinceId) queryParams.append('provinceId', provinceId);
    try {
        const response = await axios.get(`${baseURL}/api/popular/post-categories?${queryParams.toString()}`, {
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

export const fetchPopularTourCategories = async (provinceId) => {
    const token = getCookie('token');
    const queryParams = new URLSearchParams();
    if (provinceId) queryParams.append('provinceId', provinceId);
    try {
        const response = await axios.get(`${baseURL}/api/popular/tour-categories?${queryParams.toString()}`, {
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
