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

        const response = await axios.get(`${baseURL}/api/staff?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const { data } = response.data;
        const { items } = data;

        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const staff = items.map(item => ({
            staffId: item.staffId,
            fullName: item.fullName,
            email: item.email,
            phone: item.phoneNumber,
            createdAt: item.createdAt,
            isDeleted: item.isDeleted,
        }));

        return {
            data: staff,
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            total: data.total
        };

    } catch (error) {
        console.error('Error fetching staff:', error);
        throw error;
    }
};

export const createStaff = async (staffData) => {
    const token = getCookie('token');
    try {
        const payload = {
            email: staffData.email,
            phoneNumber: staffData.phoneNumber,
            fullName: staffData.fullName
        };
        const response = await axios.post(`${baseURL}/api/account/create-staff-account`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating staff:', error);
        throw error;
    }
};

export const changeStaffStatus = async (staffId, isDeleted) => {
    const token = getCookie('token');
    try {
        const response = await axios.patch(
            `${baseURL}/api/staff/change-staff-status/${staffId}?isDeleted=${isDeleted}`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error changing staff status:', error);
        throw error;
    }
};

export const updateStaff = async (staffData) => {
    const token = getCookie('token');
    try {
        const response = await axios.put(
            `${baseURL}/api/staff/${staffData.staffId}`,
            staffData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating staff:', error);
        throw error;
    }
};

export const changeStaffPassword = async (oldPassword, newPassword) => {
    const request = {
        oldPassword: oldPassword,
        newPassword: newPassword
    };
    const token = getCookie('token');
    try {
        const response = await axios.patch(`${baseURL}/api/staff/change-staff-password`, request, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error changing staff password:', error);
        throw error;
    }
};

export const adminResetStaffPassword = async (staffId) => {
    const token = getCookie('token');
    try {
        const response = await axios.patch(
            `${baseURL}/api/staff/admin-reset-staff-password?staffId=${staffId}`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error resetting staff password:', error);
        throw error;
    }
};

export const getStaffProfile = async () => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/staff/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const { data } = response.data;
        return {
            phoneNumber: data.phoneNumber,
            email: data.email,
            fullName: data.fullName
        };
    } catch (error) {
        console.error('Error fetching staff profile:', error);
        throw error;
    }
};