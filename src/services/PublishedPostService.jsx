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
        return [];
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