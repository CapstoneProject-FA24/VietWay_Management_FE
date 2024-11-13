import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const fetchStaff = async (params) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params.pageSize);
        queryParams.append('pageIndex', params.pageIndex);
        if (params.nameSearch) queryParams.append('nameSearch', params.nameSearch);
        if (params.emailSearch) queryParams.append('emailSearch', params.emailSearch);
        if (params.phoneSearch) queryParams.append('phoneSearch', params.phoneSearch);

        const response = await axios.get(`${baseURL}/api/staff?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const items = response.data?.data?.items;

        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const staff = items.map(item => ({
            staffId: item.staffId,
            fullName: item.fullName,
            email: item.email,
            phone: item.phoneNumber,
            createdAt: item.createdAt,
            isDeleted: item.isDeleted
        }));
        return ({
            data: staff,
            pageIndex: response.data?.data?.pageIndex,
            pageSize: response.data?.data?.pageSize,
            total: response.data?.data?.total
        })

    } catch (error) {
        console.error('Error fetching staff:', error);
        throw error;
    }
};