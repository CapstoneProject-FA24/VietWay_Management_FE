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

export const fetchTourTemplates = async (params) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params.pageSize);
        queryParams.append('pageIndex', params.pageIndex);
        if (params.searchTerm) queryParams.append('nameSearch', params.searchTerm);
        if (params.templateCategoryIds) params.templateCategoryIds.forEach(id => queryParams.append('templateCategoryIds', id));
        if (params.durationIds) params.durationIds.forEach(id => queryParams.append('durationIds', id));
        if (params.provinceIds) params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        if (params.status !== undefined && params.status !== null) queryParams.append('status', params.status);

        const response = await axios.get(`${baseURL}/api/TourTemplate?${queryParams.toString()}`);
        const items = response.data?.data?.items;
        
        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const templates = items.map(item => ({
            tourTemplateId: item.tourTemplateId,
            code: item.code,
            tourName: item.tourName,
            duration: item.duration,
            tourCategory: item.tourCategory,
            status: item.status,
            statusName: getStatusText(item.status),
            createdDate: item.createdDate,
            creatorName: item.creatorName,
            provinces: item.provinces,
            imageUrl: item.imageUrl
        }));

        return ({
            data: templates,
            pageIndex: response.data?.data?.pageIndex,
            pageSize: response.data?.data?.pageSize,
            total: response.data?.data?.total
        })
        
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
            tourCategoryId: response.data.data.tourCategory.tourCategoryId,
            tourCategoryName: response.data.data.tourCategory.tourCategoryName,
            policy: response.data.data.policy,
            note: response.data.data.note,
            status: response.data.data.status,
            statusName: getStatusText(response.data.data.status),
            createdDate: response.data.data.createdDate,
            creatorName: response.data.data.creatorName,
            provinces: response.data.data.provinces,
            schedule: response.data.data.schedules,
            imageUrls: response.data.data.images
        };
    } catch (error) {
        console.error('Error fetching tour template:', error);
        throw error;
    }
};

export const createTourTemplate = async (tourTemplateData) => {
    try {
        const formData = new FormData();
        
        formData.append("Code", tourTemplateData.code);
        formData.append("TourName", tourTemplateData.tourName);
        formData.append("Description", tourTemplateData.description);
        formData.append("Duration", tourTemplateData.duration);
        formData.append("TourCategoryId", tourTemplateData.tourCategoryId);
        formData.append("Policy", tourTemplateData.policy);
        formData.append("Note", tourTemplateData.note);

        tourTemplateData.provinces.forEach((province) => {
            formData.append("ProvinceId", province); // Correct naming
        });

        tourTemplateData.schedule.forEach((s, index) => {
            formData.append(`Schedules[${index}].dayNumber`, s.dayNumber);
            formData.append(`Schedules[${index}].title`, s.title);
            formData.append(`Schedules[${index}].description`, s.description);
            s.attractions.forEach((attraction, attIndex) => {
                formData.append(`Schedules[${index}].attractionId[${attIndex}]`, attraction);
            });
        });

        tourTemplateData.imageUrls.forEach((image) => {
            formData.append("Images", image);
        });

        const response = await axios.post(`${baseURL}/api/TourTemplate`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error saving tour template:', error);
        throw error;
    }
};