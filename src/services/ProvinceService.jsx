const baseURL = import.meta.env.VITE_API_URL;
import axios from 'axios';
import { getCookie } from '@services/AuthenService';

export const fetchProvinces = async (params) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params.pageSize || 63);
        queryParams.append('pageIndex', params.pageIndex || 1);
        if (params.nameSearch) queryParams.append('nameSearch', params.nameSearch);
        const response = await axios.get(`${baseURL}/api/provinces?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return {
            total: response.data.data.total,
            pageSize: response.data.data.pageSize,
            pageIndex: response.data.data.pageIndex,
            items: response.data.data.items.map(province => ({
                provinceId: province.provinceId,
                provinceName: province.provinceName,
                description: province.description,
                imageUrl: province.imageUrl
            }))
        };
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error;
    }
};

export const updateProvince = async (provinceId, request) => {
    const token = getCookie('token');
    try {
        const response = await axios.put(`${baseURL}/api/provinces/${provinceId}`, request, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating province:', error);
        throw error;
    }
};

export const deleteProvince = async (provinceId) => {
    const token = getCookie('token');
    try {
        const response = await axios.delete(`${baseURL}/api/provinces/${provinceId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting province:', error);
        throw error;
    }
};

export const createProvince = async (request) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(
            `${baseURL}/api/provinces`, request ,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating province:', error);
        throw error;
    }
};

export const addOrUpdateProvinceImage = async (provinceId, imageFile) => {
    const token = getCookie('token');
    try {
        const formData = new FormData();
        formData.append('newImage', imageFile);

        const response = await axios.patch(
            `${baseURL}/api/provinces/${provinceId}/images`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding province image:', error);
        throw error;
    }
};