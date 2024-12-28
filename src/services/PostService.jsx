import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const fetchPosts = async (params) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params?.pageSize || 10);
        queryParams.append('pageIndex', params?.pageIndex || 1);
        if (params.searchTerm) queryParams.append('nameSearch', params.searchTerm);
        if (params.postCategoryIds?.length > 0) params.postCategoryIds.forEach(id => queryParams.append('postCategoryIds', id));
        if (params.provinceIds?.length > 0) params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        if (params.statuses) params.statuses.forEach(status => queryParams.append('statuses', status));

        const response = await axios.get(`${baseURL}/api/posts?${queryParams.toString()}`);
        const items = response.data?.data?.items;

        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid response structure: items not found or not an array');
        }

        const posts = items.map(item => ({
            postId: item.postId,
            title: item.title,
            image: item.imageUrl,
            content: item.content,
            category: item.postCategory,
            province: item.province,
            description: item.description,
            createdAt: item.createdAt,
            status: item.status
        }));

        return {
            data: posts,
            pageIndex: response.data?.data?.pageIndex,
            pageSize: response.data?.data?.pageSize,
            total: response.data?.data?.total
        };

    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const fetchPostById = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/posts/${id}`);
        const item = response.data.data;
        
        const facebookPost = item.socialPostDetail?.find(post => post.site === 0);
        const twitterPost = item.socialPostDetail?.find(post => post.site === 1);

        return {
            postId: item.postId,
            title: item.title,
            imageUrl: item.imageUrl,
            content: item.content,
            postCategoryName: item.postCategoryName,
            postCategoryId: item.postCategoryId,
            provinceName: item.provinceName,
            provinceId: item.provinceId,
            description: item.description,
            createdAt: item.createAt,
            status: item.status,
            facebookPostId: facebookPost?.socialPostId,
            xTweetId: twitterPost?.socialPostId,
            facebookPostCreatedAt: facebookPost?.createdAt,
            xTweetCreatedAt: twitterPost?.createdAt
        };
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};

export const createPost = async (postData) => {
    const token = getCookie('token');
    try {
        const post = {
            title: postData.title,
            content: postData.content,
            postCategoryId: postData.postCategoryId,
            provinceId: postData.provinceId,
            description: postData.description,
            isDraft: postData.isDraft
        };
        const response = await axios.post(`${baseURL}/api/posts`, post, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

export const updatePost = async (id, postData) => {
    const token = getCookie('token');
    try {
        const post = {
            title: postData.title,
            content: postData.content,
            postCategoryId: postData.postCategoryId,
            provinceId: postData.provinceId,
            description: postData.description,
            isDraft: postData.isDraft
        };
        const response = await axios.put(`${baseURL}/api/posts/${id}`, post, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
};

export const deletePost = async (id) => {
    const token = getCookie('token');
    try {
        await axios.delete(`${baseURL}/api/posts/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

export const changePostStatus = async (postId, status, reason) => {
    const token = getCookie('token');
    try {
        const requestData = {
            status: status,
            reason: reason
        };

        const response = await axios.patch(`${baseURL}/api/posts/change-post-status/${postId}`, requestData, {
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

export const sharePostOnTwitter = async (postId) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/published-posts/post/${postId}/twitter`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sharing post on Twitter:', error);
        throw error;
    }
};

export const sharePostOnFacebook = async (postId) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/published-posts/post/${postId}/facebook`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sharing post on Facebook:', error);
        throw error;
    }
};

export const updatePostImages = async (postId, newImages) => {
    const token = getCookie('token');
    try {
        const formData = new FormData();
        if (newImages) {
            newImages.forEach((image) => {
                formData.append("newImage", image);
            });
        }

        const response = await axios.patch(`${baseURL}/api/posts/${postId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating post images:', error.response);
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
