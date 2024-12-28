import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const fetchAttractions = async (params) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params.pageSize);
        queryParams.append('pageIndex', params.pageIndex);
        if (params.nameSearch) queryParams.append('nameSearch', params.nameSearch);
        if (params.attractionTypeIds) params.attractionTypeIds.forEach(id => queryParams.append('attractionTypeIds', id));
        if (params.provinceIds) params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        if (params.statuses) params.statuses.forEach(status => queryParams.append('statuses', status));
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
            name: item.name,
            address: item.address,
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
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/attractions/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = response.data.data;

        const twitterPost = data.socialPostDetail?.find(post => post.site === 1);
        const facebookPost = data.socialPostDetail?.find(post => post.site === 0);

        const attraction = {
            attractionId: data.attractionId,
            name: data.name,
            address: data.address,
            contactInfo: data.contactInfo,
            website: data.website,
            description: data.description,
            googlePlaceId: data.googlePlaceId,
            status: data.status,
            createdDate: data.createdDate,
            provinceId: data.province.provinceId,
            provinceName: data.province.provinceName,
            attractionTypeId: data.attractionType.attractionCategoryId,
            attractionTypeName: data.attractionType.name,
            images: data.images.map(image => ({
                imageId: image.imageId,
                url: image.imageUrl
            })),
            facebookPostId: facebookPost?.socialPostId || null,
            xTweetId: twitterPost?.socialPostId || null,
            facebookPostCreatedAt: facebookPost?.createdAt || null,
            xTweetCreatedAt: twitterPost?.createdAt || null
        };
        return attraction;
    } catch (error) {
        console.error('Error fetching attraction:', error);
        throw error;
    }
};

export const createAttraction = async (attractionData) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/attractions`, {
            name: attractionData.name,
            address: attractionData.address,
            contactInfo: attractionData.contactInfo,
            website: attractionData.website,
            description: attractionData.description,
            provinceId: attractionData.provinceId,
            attractionCategoryId: attractionData.attractionTypeId,
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
    console.log(newImages);
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
    const token = getCookie('token');
    try {
        const response = await axios.put(`${baseURL}/api/attractions/${attractionData.id}`, {
            name: attractionData.name,
            address: attractionData.address,
            contactInfo: attractionData.contactInfo,
            website: attractionData.website,
            description: attractionData.description,
            provinceId: attractionData.provinceId,
            attractionCategoryId: attractionData.attractionTypeId,
            googlePlaceId: attractionData.googlePlaceId,
            isDraft: attractionData.isDraft
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error updating attraction:', error.response);
        throw error;
    }
};

export const changeAttractionStatus = async (attractionId, status, reason) => {
    const token = getCookie('token');
    try {
        const requestData = {
            status: status,
            reason: reason
        };
        const response = await axios.patch(`${baseURL}/api/attractions/${attractionId}/status`, requestData, {
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

export const getAttractionReviews = async (attractionId, options) => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/attractions/${attractionId}/reviews`, {
            params: options,
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
        const response = await axios.patch(`${baseURL}/api/attractions/reviews/${reviewId}/hide`, {
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

export const deleteAttraction = async (attractionId) => {
    const token = getCookie('token');
    try {
        const response = await axios.delete(`${baseURL}/api/attractions/${attractionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting attraction:', error.response);
        throw error;
    }
};

export const fetchApprovedttractions = async (params) => {
    console.log(params);
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params.pageSize);
        queryParams.append('pageIndex', params.pageIndex);
        if (params.nameSearch) queryParams.append('nameSearch', params.nameSearch);
        if (params.attractionTypeIds) params.attractionTypeIds.forEach(id => queryParams.append('attractionTypeIds', id));
        if (params.provinceIds) params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        if (params.attractionIds) params.attractionIds.forEach(attractionId => queryParams.append('attractionIds', attractionId));
        const response = await axios.get(`${baseURL}/api/attractions/approved-attraction?${queryParams.toString()}`, {
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
            name: item.name,
            address: item.address,
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

export const shareAttractionOnTwitter = async (attractionId) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/published-posts/attraction/${attractionId}/twitter`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sharing attraction on Twitter:', error.response);
        throw error;
    }
};

export const shareAttractionOnFacebook = async (attractionId) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/published-posts/attraction/${attractionId}/facebook`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sharing attraction on Facebook:', error);
        throw error;
    }
};

export const getTwitterReactionsByPostId = async (entityId) => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/published-posts/${entityId}/twitter/reactions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const metricsData = JSON.parse(response.data.data);
        return {
            retweetCount: metricsData.retweetCount || 0,
            replyCount: metricsData.replyCount || 0,
            likeCount: metricsData.likeCount || 0,
            quoteCount: metricsData.quoteCount || 0,
            bookmarkCount: metricsData.bookmarkCount || 0,
            impressionCount: metricsData.impressionCount || 0
        };
    } catch (error) {
        console.error('Error fetching Twitter reactions:', error.response);
        return {
            retweetCount: 0,
            replyCount: 0,
            likeCount: 0,
            quoteCount: 0,
            bookmarkCount: 0,
            impressionCount: 0
        };
    }
};

export const getFacebookReactionsByPostId = async (postId) => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/published-posts/${postId}/facebook/metrics`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const metrics = response.data.data;
        
        return {
            impressionCount: metrics.impressionCount,
            shareCount: metrics.shareCount,
            commentCount: metrics.commentCount,
            reactionCount: Object.values(metrics.postReactions).reduce((a, b) => a + b, 0),
            reactionDetails: metrics.postReactions
        };
    } catch (error) {
        console.error('Error fetching Facebook reactions:', error.response);
        throw error;
    }
};