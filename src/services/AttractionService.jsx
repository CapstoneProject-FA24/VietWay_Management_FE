import axios from 'axios';
import baseURL from '@api/baseURL'
import { getCookie } from '@services/AuthenService';
const token = getCookie('token');

export const fetchAttractions = async (params) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params.pageSize);
        queryParams.append('pageIndex', params.pageIndex);
        if (params.nameSearch) queryParams.append('nameSearch', params.nameSearch);
        if (params.attractionTypeIds) params.attractionTypeIds.forEach(id => queryParams.append('attractionTypeIds', id));
        if (params.provinceIds) params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        if (params.status !== undefined && params.status !== null) queryParams.append('status', params.status);
        const response = await axios.get(`${baseURL}/api/attractions?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const items = response.data?.data?.items;

        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const attractions = items.map(item => ({
            attractionId: item.attractionId,
            name: item.name || "Không có",
            address: item.address || "Không có",
            status: item.status,
            attractionType: item.attractionType,
            createdDate: item.createdAt,
            creatorName: item.creatorName,
            province: item.province,
            imageUrl: item.imageUrl
        }));

        return ({
            data: attractions,
            pageIndex: response.data?.data?.pageIndex,
            pageSize: response.data?.data?.pageSize,
            total: response.data?.data?.total
        })

    } catch (error) {
        console.error('Error fetching tour attractions:', error);
        throw error;
    }
};

export const fetchAttractionById = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/attractions/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = response.data.data;
        console.log(data);
        const attraction = {
            attractionId: data.attractionId,
            name: data.name || "Không có",
            address: data.address || "Không có",
            contactInfo: data.contactInfo || "Không có",
            website: data.website || "Không có",
            description: data.description || "Không có",
            googlePlaceId: data.googlePlaceId || "Không có",
            status: data.status,
            createdDate: data.createdDate,
            creatorName: data.creatorName || "Không có",
            provinceId: data.province.provinceId || "Không có",
            provinceName: data.province.provinceName || "Không có",
            imageURL: data.province.imageURL,
            attractionTypeId: data.attractionType.attractionCategoryId || "Không có",
            attractionTypeName: data.attractionType.name || "Không có",
            images: data.images.map(image => ({
                imageId: image.imageId,
                url: image.url
            }))
        };
        return attraction;
    } catch (error) {
        console.error('Error fetching attraction:', error);
        throw error;
    }
};

export const createAttraction = async (attractionData) => {
    try {
        const response = await axios.post(`${baseURL}/api/Attraction`, {
            name: attractionData.name,
            address: attractionData.address,
            contactInfo: attractionData.contactInfo,
            website: attractionData.website,
            description: attractionData.description,
            provinceId: attractionData.provinceId,
            attractionTypeId: attractionData.attractionTypeId,
            googlePlaceId: attractionData.googlePlaceId,
            isDraft: attractionData.isDraft
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating attraction:', error);
        throw error;
    }
};


export const updateAttractionImages = async (attractionId, newImages, deletedImageIds) => {
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

        const response = await axios.patch(`${baseURL}/api/attractions/${attractionId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating attraction images:', error.response);
        throw error;
    }
};

export const updateAttraction = async (attractionData) => {
    try {
        const response = await axios.put(`${baseURL}/api/attractions/${attractionData.id}`, {
            name: attractionData.name,
            address: attractionData.address,
            contactInfo: attractionData.contactInfo,
            website: attractionData.website,
            description: attractionData.description,
            provinceId: attractionData.provinceId,
            attractionTypeId: attractionData.attractionTypeId,
            googlePlaceId: attractionData.googlePlaceId,
            isDraft: attractionData.isDraft
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating attraction:', error.response);
        throw error;
    }
};