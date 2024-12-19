import axios from 'axios';
import { getCookie } from '@services/AuthenService';

const baseURL = import.meta.env.VITE_API_URL;

export const fetchEntityHistory = async (entityId, entityType) => {
    const token = getCookie('token');
    try {
        const response = await axios.get(
            `${baseURL}/api/entity-histories/${entityId}?entityType=${entityType}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const { data } = response.data;
        console.log(response.data);
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid response structure: data is not an array');
        }

        return data.map(item => ({
            modifierRole: item.modifierRole,
            reason: item.reason,
            action: item.action,
            timestamp: item.timestamp,
            oldStatus: item.oldStatus,
            newStatus: item.newStatus,
            modifiedBy: item.modifiedBy,
            modifierName: item.modifierName
        }));
    } catch (error) {
        console.error('Error fetching entity history:', error);
        throw error;
    }
};
