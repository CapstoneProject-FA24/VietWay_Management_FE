import baseURL from '@api/baseURL'
import { mockProvinces } from '@hooks/Provinces'
import { mockTourTemplateCategories } from '@hooks/MockTourTemplate'

const getStatusText = (status) => {
    switch (status) {
        case 0: return 'Bản nháp';
        case 1: return 'Chờ duyệt';
        case 2: return 'Đã duyệt';
        case 3: return 'Từ chối';
        default: return 'Không xác định';
    }
};

export const fetchTourTemplates = async () => {
    try {
        const response = await fetch(`${baseURL}/api/TourTemplate?pageSize=10&pageIndex=1`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result.data.items.map(item => ({
            TourTemplateId: item.tourTemplateId,
            TourCode: item.code,
            TourName: item.tourName,
            Duration: item.duration,
            TourCategory: mockTourTemplateCategories.find(category => category.CategoryId === item.tourCategoryId)?.CategoryName || '',
            Status: item.status,
            StatusName: getStatusText(item.status),
            CreatedDate: item.createdDate,
            CreatedBy: item.creatorName,
            TourTemplateProvinces: item.provinces,
            TourTemplateImage: item.imageUrl
        }));
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};

export const fetchTourTemplateById = async (id) => {
    try {
        const response = await fetch(`${baseURL}/api/TourTemplate/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return {
            TourTemplateId: result.data.tourTemplateId,
            TourCode: result.data.code,
            TourName: result.data.tourName,
            Description: result.data.description,
            Duration: result.data.duration,
            TourCategory: mockTourTemplateCategories.find(category => category.CategoryId === result.data.tourCategoryId)?.CategoryName || '',
            Policy: result.data.policy,
            Note: result.data.note,
            Status: result.data.status,
            StatusName: getStatusText(result.data.status),
            CreatedDate: result.data.createdDate,
            CreatedBy: result.data.creatorName,
            TourTemplateProvinces: result.data.provinces,
            TourTemplateSchedule: result.data.schedule,
            TourTemplateImages: result.data.imageUrls
        };
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};