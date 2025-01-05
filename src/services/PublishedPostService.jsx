import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const getTwitterReactionsByPostId = async (entityId, entityType) => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/published-posts/${entityId}/twitter/reactions`, {
            params: {
                entityType
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const metricsData = response.data.data;
        return metricsData.map(tweet => ({
            xTweetId: tweet.xTweetId,
            retweetCount: tweet.retweetCount || 0,
            replyCount: tweet.replyCount || 0,
            likeCount: tweet.likeCount || 0,
            quoteCount: tweet.quoteCount || 0,
            bookmarkCount: tweet.bookmarkCount || 0,
            impressionCount: tweet.impressionCount || 0,
            createdAt: tweet.createdAt
        }));
    } catch (error) {
        console.error('Error fetching Twitter reactions:', error.response);
        throw error;
    }
};

export const getFacebookReactions = async (entityId, entityType) => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/published-posts/${entityId}/facebook/metrics`, {
            params: {
                entityType
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const metricsArray = response.data.data;
        
        return metricsArray.map(metrics => ({
            impressionCount: metrics.impressionCount,
            shareCount: metrics.shareCount,
            commentCount: metrics.commentCount,
            reactionCount: Object.values(metrics.postReactions).reduce((a, b) => a + b, 0),
            reactionDetails: metrics.postReactions,
            createdAt: metrics.createdAt,
            facebookPostId: metrics.facebookPostId
        }));
    } catch (error) {
        console.error('Error fetching Facebook reactions:', error.response);
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

export const shareTemplateOnTwitter = async (templateId) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/published-posts/tour-template/${templateId}/twitter`, {}, {
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
        console.error('Error sharing attraction on Facebook:', error.response);
        throw error;
    }
};

export const shareTemplateOnFacebook = async (templateId) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/published-posts/tour-template/${templateId}/facebook`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sharing template on Facebook:', error.response);
        throw error;
    }
};