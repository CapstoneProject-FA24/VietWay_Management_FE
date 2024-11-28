import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const fetchManager = async (params) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params.pageSize);
        queryParams.append('pageIndex', params.pageIndex);
        if (params.nameSearch) queryParams.append('nameSearch', params.nameSearch);

        const response = await axios.get(`${baseURL}/api/manager?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const { data } = response.data;
        const { items } = data;

        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const managers = items.map(item => ({
            managerId: item.managerId,
            fullName: item.fullName,
            email: item.email,
            phone: item.phoneNumber,
            createdAt: item.createdAt,
            isDeleted: item.isDeleted,
        }));

        return {
            data: managers,
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            total: data.total
        };

    } catch (error) {
        console.error('Error fetching managers:', error);
        throw error;
    }
};

export const createManager = async (managerData) => {
    const token = getCookie('token');
    try {
        const payload = {
            email: managerData.email,
            phoneNumber: managerData.phoneNumber,
            fullName: managerData.fullName
        };
        const response = await axios.post(`${baseURL}/api/account/create-manager-account`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating manager:', error);
        throw error;
    }
};

export const changeManagerStatus = async (managerId, isDeleted) => {
    const token = getCookie('token');
    try {
        const response = await axios.patch(
            `${baseURL}/api/manager/change-manager-account-status/${managerId}?isDeleted=${isDeleted}`, null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error changing manager status:', error);
        throw error;
    }
};

export const updateManager = async (managerData) => {
    const token = getCookie('token');
    try {
        const response = await axios.put(
            `${baseURL}/api/manager/${managerData.managerId}`,
            managerData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating manager:', error);
        throw error;
    }
};