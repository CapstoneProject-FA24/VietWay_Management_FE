import baseURL from '@api/baseURL'
import axios from 'axios';

export const fetchProvinces = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/Province`);
        return response.data.data.map(province => ({
            provinceId: province.provinceId,
            provinceName: province.provinceName,
            imageURL: province.imageUrl
        }));
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};