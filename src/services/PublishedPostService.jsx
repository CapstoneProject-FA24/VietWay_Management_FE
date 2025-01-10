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
            createdAt: tweet.createdAt,
            hashtags: tweet.hashtags
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
            facebookPostId: metrics.facebookPostId,
            hashtags: metrics.hashtags
        }));
    } catch (error) {
        console.error('Error fetching Facebook reactions:', error.response);
        throw error;
    }
};

export const sharePostOnTwitter = async (postId, hashtags = []) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/published-posts/post/${postId}/twitter`, 
            hashtags,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sharing post on Twitter:', error);
        throw error;
    }
};

export const sharePostOnFacebook = async (postId, hashtags = []) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(`${baseURL}/api/published-posts/post/${postId}/facebook`, 
            hashtags,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sharing post on Facebook:', error);
        throw error;
    }
};

export const shareAttractionOnTwitter = async (attractionId, hashtags = []) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(
            `${baseURL}/api/published-posts/attraction/${attractionId}/twitter`, 
            hashtags,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sharing attraction on Twitter:', error.response);
        throw error;
    }
};

export const shareTemplateOnTwitter = async (templateId, hashtags = []) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(
            `${baseURL}/api/published-posts/tour-template/${templateId}/twitter`, 
            hashtags,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sharing template on Twitter:', error.response);
        throw error;
    }
};

export const shareAttractionOnFacebook = async (attractionId, hashtags = []) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(
            `${baseURL}/api/published-posts/attraction/${attractionId}/facebook`, 
            hashtags,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sharing attraction on Facebook:', error.response);
        throw error;
    }
};

export const shareTemplateOnFacebook = async (templateId, hashtags = []) => {
    const token = getCookie('token');
    try {
        const response = await axios.post(
            `${baseURL}/api/published-posts/tour-template/${templateId}/facebook`, 
            hashtags,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sharing template on Facebook:', error.response);
        throw error;
    }
};

export const getHashtags = async () => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/published-posts/hashtag`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.data.map(hashtag => ({
            id: hashtag.hashtagId,
            name: hashtag.hashtagName.replace('#', '')
        }));
    } catch (error) {
        console.error('Error fetching hashtags:', error.response);
        throw error;
    }
};