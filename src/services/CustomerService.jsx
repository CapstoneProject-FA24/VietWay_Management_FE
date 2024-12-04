import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const fetchCustomer = async (params) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params.pageSize);
        queryParams.append('pageIndex', params.pageIndex);
        if (params.nameSearch) queryParams.append('nameSearch', params.nameSearch);

        const response = await axios.get(`${baseURL}/api/customers?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const { data } = response.data;
        const { items } = data;

        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const customers = items.map(item => ({
            customerId: item.customerId,
            fullName: item.fullName,
            email: item.email,
            phone: item.phoneNumber,
            createdAt: item.createdAt,
            isDeleted: item.isDeleted,
        }));

        return {
            data: customers,
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            total: data.total
        };

    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};

export const changeCustomerStatus = async (customerId, isDeleted) => {
    const token = getCookie('token');
    try {
        const response = await axios.patch(
            `${baseURL}/api/customers/${customerId}?isDeleted=${isDeleted}`, null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error changing customer status:', error);
        throw error;
    }
};