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

export const fetchAttractions = async (params) => {
    try {
        console.log(params);
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params.pageSize);
        queryParams.append('pageIndex', params.pageIndex);
        if (params.nameSearch) queryParams.append('nameSearch', params.nameSearch);
        if (params.attractionTypeIds) params.attractionTypeIds.forEach(id => queryParams.append('attractionTypeIds', id));
        if (params.provinceIds) params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        if (params.status !== undefined && params.status !== null) queryParams.append('status', params.status);

        const response = await axios.get(`${baseURL}/api/Attraction?${queryParams.toString()}`);
        const items = response.data?.data?.items;

        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const attractions = items.map(item => ({
            attractionId: item.attractionId,
            name: item.name,
            address: item.address,
            status: item.status,
            statusName: getStatusText(item.status),
            attractionType: item.attractionType,
            createdDate: item.createdDate,
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

export const getAttractionById = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/Attraction/${id}`);
        const data = response.data.data;
        console.log(data);
        const attraction = {
            attractionId: data.attractionId,
            name: data.name,
            address: data.address,
            contactInfo: data.contactInfo,
            website: data.website,
            description: data.description,
            googlePlaceId: data.googlePlaceId,
            status: data.status,
            statusName: getStatusText(data.status),
            createdDate: data.createdDate,
            creatorName: data.creatorName,
            provinceId: data.province.provinceId,
            provinceName: data.province.provinceName,
            imageURL: data.province.imageURL,
            attractionTypeId: data.attractionType.attractionTypeId,
            attractionTypeName: data.attractionType.attractionTypeName,
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
        });
        return response.data;
    } catch (error) {
        console.error('Error creating attraction:', error);
        throw error;
    }
};


export const updateAttractionImages = async (attractionId, newImages, deletedImageIds) => {
    try {
        console.log(attractionId);
        console.log(newImages);
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

        const response = await axios.patch(`${baseURL}/api/Attraction/${attractionId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error updating attraction images:', error.response);
        throw error;
    }
};

export const updateAttraction = async (attractionData) => {
    try {
        const response = await axios.put(`${baseURL}/api/Attraction/${attractionData.id}`, {
            name: attractionData.name,
            address: attractionData.address,
            contactInfo: attractionData.contactInfo,
            website: attractionData.website,
            description: attractionData.description,
            provinceId: attractionData.provinceId,
            attractionTypeId: attractionData.attractionTypeId,
            googlePlaceId: attractionData.googlePlaceId,
            isDraft: attractionData.isDraft
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error updating attraction:', error.response);
        throw error;
    }
};

export const fetchAttractionType = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/AttractionType`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};