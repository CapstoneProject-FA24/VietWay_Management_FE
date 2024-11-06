const baseURL = import.meta.env.VITE_API_URL;
import axios from 'axios';

export const fetchProvinces = async () => {
    try {
        /* const { pageSize, pageIndex, nameSearch } = params;
        const queryParams = new URLSearchParams({
            pageSize: pageSize || 12,
            pageIndex: pageIndex || 1,
            ...(nameSearch && { nameSearch })
        }).toString(); */
        //To do: api => Province -> provinces
        const response = await axios.get(`${baseURL}/api/Province?`);
        const data = response.data.data.map(province => ({
            provinceId: province.provinceId,
            provinceName: province.provinceName,
            imageURL: province.imageUrl
        }));
        return data;
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error;
    }
};

export const updateProvince = async (provinceId, formData) => {
    try {
        const response = await axios.put(`${baseURL}/api/provinces/${provinceId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating province:', error);
        throw error;
    }
};

export const deleteProvince = async (provinceId) => {
    try {
        const response = await axios.delete(`${baseURL}/api/provinces/${provinceId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting province:', error);
        throw error;
    }
};

export const createProvince = async (formData) => {
    try {
        const response = await axios.post(`${baseURL}/api/provinces`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating province:', error);
        throw error;
    }
};