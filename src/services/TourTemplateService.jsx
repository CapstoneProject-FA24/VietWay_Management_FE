import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

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
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params.pageSize);
        queryParams.append('pageIndex', params.pageIndex);
        if (params.searchTerm) queryParams.append('nameSearch', params.searchTerm);
        if (params.templateCategoryIds) params.templateCategoryIds.forEach(id => queryParams.append('templateCategoryIds', id));
        if (params.durationIds) params.durationIds.forEach(id => queryParams.append('durationIds', id));
        if (params.provinceIds) params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        if (params.status !== undefined && params.status !== null) queryParams.append('status', params.status);

        const response = await axios.get(`${baseURL}/api/TourTemplate?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
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
            createdDate: item.createdAt,
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
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/TourTemplate/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return {
            tourTemplateId: response.data.data.tourTemplateId,
            code: response.data.data.code,
            tourName: response.data.data.tourName,
            description: response.data.data.description,
            duration: response.data.data.duration,
            maxPrice: response.data.data.maxPrice,
            minPrice: response.data.data.minPrice,
            tourCategoryId: response.data.data.tourCategory.tourCategoryId,
            tourCategoryName: response.data.data.tourCategory.tourCategoryName,
            policy: response.data.data.policy,
            note: response.data.data.note,
            status: response.data.data.status,
            statusName: getStatusText(response.data.data.status),
            createdDate: response.data.data.createdAt,
            creatorName: response.data.data.creatorName,
            startingProvince: response.data.data.startingProvince,
            transportation: response.data.data.transportation,
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
    const token = getCookie('token');
    try {
        const requestData = {
            code: tourTemplateData.code,
            tourName: tourTemplateData.tourName,
            description: tourTemplateData.description,
            durationId: tourTemplateData.durationId,
            tourCategoryId: tourTemplateData.tourCategoryId,
            policy: tourTemplateData.policy,
            note: tourTemplateData.note,
            minPrice: tourTemplateData.minPrice,
            maxPrice: tourTemplateData.maxPrice,
            provinceIds: tourTemplateData.provinceIds,
            startingProvinceId: tourTemplateData.startingProvinceId,
            transportation: tourTemplateData.transportation,
            schedules: tourTemplateData.schedules.map(s => ({
                dayNumber: s.dayNumber,
                title: s.title,
                description: s.description,
                attractionIds: s.attractionIds
            })),
            isDraft: tourTemplateData.isDraft
        };
        const response = await axios.post(`${baseURL}/api/TourTemplate`, requestData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error saving tour template:', error);
        throw error;
    }
};

export const updateTourTemplate = async (tourTemplateId, tourTemplateData) => {
    const token = getCookie('token');
    try {
        const requestData = {
            code: tourTemplateData.code,
            tourName: tourTemplateData.tourName,
            description: tourTemplateData.description,
            durationId: tourTemplateData.durationId,
            tourCategoryId: tourTemplateData.tourCategoryId,
            policy: tourTemplateData.policy,
            note: tourTemplateData.note,
            minPrice: tourTemplateData.minPrice,
            maxPrice: tourTemplateData.maxPrice,
            startingProvinceId: tourTemplateData.startingProvinceId,
            transportation: tourTemplateData.transportation,
            provinceIds: tourTemplateData.provinceIds,
            schedules: tourTemplateData.schedules.map(s => ({
                dayNumber: s.dayNumber,
                title: s.title,
                description: s.description,
                attractionIds: s.attractionIds
            })),
            isDraft: tourTemplateData.isDraft
        };
        const response = await axios.put(`${baseURL}/api/TourTemplate/${tourTemplateId}`, requestData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating tour template:', error);
        throw error;
    }
};

export const updateTemplateImages = async (tourTemplateId, newImages, deletedImageIds) => {
    const token = getCookie('token');
    try {
        const formData = new FormData();
        if (newImages) {
            newImages.forEach((image) => {
                formData.append("NewImages", image);
            });
        }
        if (deletedImageIds) {
            deletedImageIds.forEach((imageId) => {
                formData.append("DeletedImageIds", imageId);
            });
        }

        const response = await axios.patch(`${baseURL}/api/TourTemplate/${tourTemplateId}/images`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating tour template images:', error.response);
        throw error;
    }
};

export const changeTourTemplateStatus = async (tourTemplateId, status, reason) => {
    const token = getCookie('token');
    try {
        const requestData = {
            status: status,
            reason: reason
        };

        const response = await axios.patch(`${baseURL}/api/TourTemplate/change-tour-template-status/${tourTemplateId}`, requestData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error changing tour template status:', error.response);
        throw error;
    }
};

export const getTourTemplateReviews = async (tourTemplateId, options) => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/TourTemplate/${tourTemplateId}/reviews`, {
            params: {
                ratingValue: options.ratingValue,
                hasReviewContent: options.hasReviewContent,
                pageSize: options.pageSize,
                pageIndex: options.pageIndex,
                isDeleted: options.isDeleted
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return {
            total: response.data.data.total,
            pageSize: response.data.data.pageSize,
            pageIndex: response.data.data.pageIndex,
            items: response.data.data.items.map(review => ({
                reviewId: review.reviewId,
                rating: review.rating,
                review: review.review,
                createdAt: review.createdAt,
                reviewer: review.reviewer,
                likeCount: review.likeCount,
                isDeleted: review.isDeleted
            }))
        };
    } catch (error) {
        console.error('Error fetching attraction reviews:', error.response);
        throw error;
    }
};

export const toggleReviewVisibility = async (reviewId, isHidden, reason) => {
    const token = getCookie('token');
    try {
        const response = await axios.patch(`${baseURL}/api/TourTemplate/reviews/${reviewId}/hide`, {
            isHided: isHidden,
            reason: reason
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error toggling review visibility:', error.response);
        throw error;
    }
};

export const deleteTourTemplate = async (tourTemplateId) => {
    const token = getCookie('token');
    try {
        const response = await axios.delete(`${baseURL}/api/TourTemplate/${tourTemplateId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting tour template:', error.response);
        throw error;
    }
};

export const fetchTourTemplatesWithTourInfo = async (params) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params.pageSize);
        queryParams.append('pageIndex', params.pageIndex);
        if (params.searchTerm) queryParams.append('nameSearch', params.searchTerm);
        if (params.templateCategoryIds) params.templateCategoryIds.forEach(id => queryParams.append('templateCategoryIds', id));
        if (params.provinceIds) params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        if (params.numberOfDay) queryParams.append('numberOfDay', params.numberOfDay);
        if (params.startDateFrom) queryParams.append('startDateFrom', params.startDateFrom);
        if (params.startDateTo) queryParams.append('startDateTo', params.startDateTo);
        if (params.minPrice) queryParams.append('minPrice', params.minPrice);
        if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
        if (params.tourId) queryParams.append('tourId', params.tourId);

        const response = await axios.get(`${baseURL}/api/TourTemplate/with-tour-info?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

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
            description: item.description,
            note: item.note,
            provinces: item.provinces,
            imageUrl: item.imageUrl,
            transportation: item.transportation,
            schedules: item.schedules.map(schedule => ({
                dayNumber: schedule.dayNumber,
                title: schedule.title,
                description: schedule.description,
                attractions: schedule.attractions.map(attraction => ({
                    attractionId: attraction.attractionId,
                    name: attraction.name,
                    address: attraction.address,
                    province: attraction.province,
                    attractionType: attraction.attractionType,
                    status: attraction.status,
                    imageUrl: attraction.imageUrl,
                    createdAt: attraction.createdAt
                }))
            })),
            tours: item.tours.map(tour => ({
                tourId: tour.tourId,
                startLocation: tour.startLocation,
                startDate: tour.startDate,
                defaultTouristPrice: tour.defaultTouristPrice,
                maxParticipant: tour.maxParticipant,
                minParticipant: tour.minParticipant,
                currentParticipant: tour.currentParticipant,
                depositPercent: tour.depositPercent,
                paymentDeadline: tour.paymentDeadline,
                tourPrices: tour.tourPrices.map(price => ({
                    priceId: price.priceId,
                    name: price.name,
                    price: price.price,
                    ageFrom: price.ageFrom,
                    ageTo: price.ageTo
                })),
                tourPolicies: tour.tourPolicies.map(policy => ({
                    cancelBefore: policy.cancelBefore,
                    refundPercent: policy.refundPercent,
                }))
            }))
        }));

        return ({
            data: templates,
            pageIndex: response.data?.data?.pageIndex,
            pageSize: response.data?.data?.pageSize,
            total: response.data?.data?.total
        });

    } catch (error) {
        console.error('Error fetching tour templates with tour info:', error);
        throw error;
    }
};