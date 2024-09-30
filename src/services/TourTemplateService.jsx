import axios from 'axios';
import baseURL from '@api/baseURL'

const getStatusText = (status) => {
    switch (status) {
        case 0: return 'Bản nháp';
        case 1: return 'Chờ duyệt';
        case 2: return 'Đã duyệt';
        case 3: return 'Từ chối';
        default: return 'Không xác định';
    }
};

export const fetchTourTemplates = async (pageSize, pageIndex) => {
    try {
        const response = await axios.get(`${baseURL}/api/TourTemplate`, {
            params: {
                pageSize: pageSize,
                pageIndex: pageIndex
            }
        });

        const items = response.data?.data?.items;
        
        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        return items.map(item => ({
            tourTemplateId: item.tourTemplateId,
            code: item.code,
            tourName: item.tourName,
            duration: item.duration,
            tourCategoryId: item.tourCategoryId,
            tourCategoryName: item.tourCategoryName,
            status: item.status,
            statusName: getStatusText(item.status),
            createdDate: item.createdDate,
            creatorName: item.creatorName,
            provinces: item.provinces,
            imageUrl: item.imageUrl
        }));
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};

export const fetchTourTemplateById = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/TourTemplate/${id}`);
        return {
            tourTemplateId: response.data.data.tourTemplateId,
            code: response.data.data.code,
            tourName: response.data.data.tourName,
            description: response.data.data.description,
            duration: response.data.data.duration,
            tourCategoryId: response.data.data.tourCategoryId,
            tourCategoryName: response.data.data.tourCategoryName,
            policy: response.data.data.policy,
            note: response.data.data.note,
            status: response.data.data.status,
            statusName: getStatusText(response.data.data.status),
            createdDate: response.data.data.createdDate,
            creatorName: response.data.data.creatorName,
            provinces: response.data.data.provinces,
            schedule: response.data.data.schedule,
            imageUrls: response.data.data.imageUrls
        };
    } catch (error) {
        console.error('Error fetching tour template:', error);
        throw error;
    }
};