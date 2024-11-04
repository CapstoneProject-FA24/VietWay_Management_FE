import axios from 'axios';
import baseURL from '@api/BaseURL';
import { getCookie } from '@services/AuthenService';

export const fetchPosts = async (params) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('pageSize', params?.pageSize || 10);
        queryParams.append('pageIndex', params?.pageIndex || 1);
        if (params.searchTerm) queryParams.append('nameSearch', params.searchTerm);
        if (params.postCategoryIds?.length > 0) params.postCategoryIds.forEach(id => queryParams.append('postCategoryIds', id));
        if (params.provinceIds?.length > 0) params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        if (params.status !== undefined && params.status !== null) queryParams.append('status', params.status);
        
        const response = await axios.get(`${baseURL}/api/Post?${queryParams.toString()}`);
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
        const item = response.data.data
        return {
            postId: item.postId,
            title: item.title,
            imageUrl: item.imageUrl,
            content: item.content,
            postCategory: item.postCategory,
            province: item.province,
            description: item.description,
            createdAt: item.createdAt,
            status: item.status
        };
    } catch (error) {
        console.error('Error fetching tour template:', error);
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
        const response = await axios.post(`${baseURL}/api/Post`, post, {
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

