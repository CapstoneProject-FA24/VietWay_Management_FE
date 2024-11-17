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
        const response = await axios.get(`${baseURL}/api/Province?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = response.data.data.items.map(province => ({
            provinceId: province.provinceId,
            provinceName: province.provinceName,
            imageUrl: province.imageUrl
        }));
        return data;
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error;
    }
};

export const updateProvince = async (provinceId, formData) => {
    const token = getCookie('token');
    try {
        const response = await axios.put(`${baseURL}/api/Province/${provinceId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
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
        const response = await axios.delete(`${baseURL}/api/Province/${provinceId}`, {
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

export const createProvince = async (provinceName) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/Province`, 
            JSON.stringify({ provinceName }),
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