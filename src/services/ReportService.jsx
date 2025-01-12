import axios from 'axios';
import { getCookie } from '@services/AuthenService';

const baseURL = import.meta.env.VITE_API_URL;

export const fetchReportSummary = async (startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/summary?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return {
            newCustomer: data.newCustomer,
            newBooking: data.newBooking,
            newTour: data.newTour,
            revenue: data.revenue,
            newAttraction: data.newAttraction,
            newPost: data.newPost,
            averageTourRating: data.averateTourRating
        };
    } catch (error) {
        console.error('Error fetching report summary:', error);
        throw error;
    }
};

export const fetchBookingReport = async (startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/booking?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return {
            totalBooking: data.totalBooking,
            bookingByDay: {
                dates: data.reportBookingByDay.dates,
                pendingBookings: data.reportBookingByDay.pendingBookings,
                depositedBookings: data.reportBookingByDay.depositedBookings,
                paidBookings: data.reportBookingByDay.paidBookings,
                completedBookings: data.reportBookingByDay.completedBookings,
                cancelledBookings: data.reportBookingByDay.cancelledBookings
            },
            bookingByTourTemplate: data.reportBookingByTourTemplate.map(item => ({
                tourTemplateName: item.tourTemplateName,
                totalBooking: item.totalBooking
            })),
            bookingByTourCategory: data.reportBookingByTourCategory.map(item => ({
                tourCategoryName: item.tourCategoryName,
                totalBooking: item.totalBooking
            })),
            bookingByParticipantCount: data.reportBookingByParticipantCount.map(item => ({
                participantCount: item.participantCount,
                bookingCount: item.bookingCount
            }))
        };
    } catch (error) {
        console.error('Error fetching booking report:', error);
        throw error;
    }
};

export const fetchRatingReport = async (startDate, endDate, isAscending = true) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        queryParams.append('isAscending', isAscending.toString());

        const response = await axios.get(`${baseURL}/api/reports/rating?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return {
            attractionRatingInPeriod: data.attractionRatingInPeriod.map(item => ({
                attractionName: item.attractionName,
                averageRating: item.averageRating,
                totalRating: item.totalRating
            })),
            tourTemplateRatingInPeriod: data.tourTemplateRatingInPeriod.map(item => ({
                tourTemplateName: item.tourTemplateName,
                averageRating: item.averageRating,
                totalRating: item.totalRating
            })),
            attractionRatingTotal: data.attractionRatingTotal.map(item => ({
                attractionName: item.attractionName,
                averageRating: item.averageRating,
                totalRating: item.totalRating
            })),
            tourTemplateRatingTotal: data.tourTemplateRatingTotal.map(item => ({
                tourTemplateName: item.tourTemplateName,
                averageRating: item.averageRating,
                totalRating: item.totalRating
            }))
        };
    } catch (error) {
        console.error('Error fetching rating report:', error);
        throw error;
    }
};

export const fetchRevenueReport = async (startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/revenue?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return {
            totalRevenue: data.totalRevenue,
            revenueByPeriod: {
                periods: data.reportRevenueByPeriod.periods,
                revenue: data.reportRevenueByPeriod.revenue,
                refund: data.reportRevenueByPeriod.refund
            },
            revenueByTourTemplate: data.reportRevenueByTourTemplate.map(item => ({
                tourTemplateName: item.tourTemplateName,
                totalRevenue: item.totalRevenue
            })),
            revenueByTourCategory: data.reportRevenueByTourCategory.map(item => ({
                tourCategoryName: item.tourCategoryName,
                totalRevenue: item.totalRevenue
            }))
        };
    } catch (error) {
        console.error('Error fetching revenue report:', error);
        throw error;
    }
};

export const fetchSocialMediaSummary = async (startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/social-media-summary?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return {
            dates: data.dates,
            facebook: {
                comments: data.facebookComments,
                shares: data.facebookShares,
                reactions: data.facebookReactions,
                impressions: data.facebookImpressions,
                score: data.facebookScore
            },
            twitter: {
                retweets: data.xRetweets,
                replies: data.xReplies,
                likes: data.xLikes,
                impressions: data.xImpressions,
                score: data.xScore
            }
        };
    } catch (error) {
        console.error('Error fetching social media summary:', error);
        throw error;
    }
};

export const fetchPromotionSummary = async (startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/promotion-summary?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return {
            facebook: {
                impressions: data.facebookImpressionCount,
                referrals: data.facebookReferralCount,
                comments: data.facebookCommentCount,
                shares: data.facebookShareCount,
                reactions: data.facebookReactionCount
            },
            twitter: {
                retweets: data.xRetweetCount,
                replies: data.xReplyCount,
                likes: data.xLikeCount,
                impressions: data.xImpressionCount,
                referrals: data.xReferralCount
            }
        };
    } catch (error) {
        console.error('Error fetching promotion summary:', error);
        throw error;
    }
};

export const fetchSocialMediaByProvince = async (startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/social-media-province?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return data.map(province => ({
            provinceId: province.provinceId,
            provinceName: province.provinceName,
            totalSitePost: province.totalSitePost,
            totalAttraction: province.totalAttraction,
            totalTourTemplate: province.totalTourTemplate,
            totalXPost: province.totalXPost,
            totalFacebookPost: province.totalFacebookPost,
            averageScore: province.averageScore,
            averageFacebookScore: province.averageFacebookScore,
            averageXScore: province.averageXScore,
            averageTourTemplateScore: province.averageTourTemplateScore,
            averageAttractionScore: province.averageAttractionScore,
            averageSitePostScore: province.averageSitePostScore
        }));
    } catch (error) {
        console.error('Error fetching social media by province:', error);
        throw error;
    }
};

export const fetchSocialMediaByAttractionCategory = async (startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/social-media-attraction-category?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return data.map(category => ({
            categoryId: category.attractionCategoryId,
            categoryName: category.attractionCategoryName,
            totalAttraction: category.totalAttraction,
            totalXPost: category.totalXPost,
            totalFacebookPost: category.totalFacebookPost,
            averageScore: category.averageScore,
            averageFacebookScore: category.averageFacebookScore,
            averageXScore: category.averageXScore,
            averageAttractionScore: category.averageAttractionScore
        }));
    } catch (error) {
        console.error('Error fetching social media by attraction category:', error);
        throw error;
    }
};

export const fetchSocialMediaByPostCategory = async (startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/social-media-post-category?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return data.map(category => ({
            categoryId: category.postCategoryId,
            categoryName: category.postCategoryName,
            totalSitePost: category.totalSitePost,
            totalXPost: category.totalXPost,
            totalFacebookPost: category.totalFacebookPost,
            averageScore: category.averageScore,
            averageFacebookScore: category.averageFacebookScore,
            averageXScore: category.averageXScore,
            averageSitePostScore: category.averageSitePostScore
        }));
    } catch (error) {
        console.error('Error fetching social media by post category:', error);
        throw error;
    }
};

export const fetchSocialMediaByTourCategory = async (startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/social-media-tour-category?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        console.log(data);
        return data.map(category => ({
            categoryId: category.tourCategoryId,
            categoryName: category.tourCategoryName,
            totalTourTemplate: category.totalTourTemplate,
            totalXPost: category.totalXPost,
            totalFacebookPost: category.totalFacebookPost,
            averageScore: category.averageScore,
            averageFacebookScore: category.averageFacebookScore,
            averageXScore: category.averageXScore,
            averageTourTemplateScore: category.averageTourTemplateScore
        }));
    } catch (error) {
        console.error('Error fetching social media by tour category:', error);
        throw error;
    }
};

export const fetchSocialMediaProvinceDetail = async (provinceId, startDate, endDate) => {
    console.log(startDate, endDate);
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/social-media-province-detail/${provinceId}?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return {
            provinceId: data.provinceId,
            provinceName: data.provinceName,
            totalSitePost: data.totalSitePost,
            totalAttraction: data.totalAttraction,
            totalTourTemplate: data.totalTourTemplate,
            totalXPost: data.totalXPost,
            totalFacebookPost: data.totalFacebookPost,
            averageScore: data.averageScore,
            averageFacebookScore: data.averageFacebookScore,
            averageXScore: data.averageXScore,
            averageTourTemplateScore: data.averageTourTemplateScore,
            averageAttractionScore: data.averageAttractionScore,
            averageSitePostScore: data.averageSitePostScore,
            socialMediaSummary: {
                dates: data.reportSocialMediaSummary.dates,
                facebook: {
                    comments: data.reportSocialMediaSummary.facebookComments,
                    shares: data.reportSocialMediaSummary.facebookShares,
                    reactions: data.reportSocialMediaSummary.facebookReactions,
                    impressions: data.reportSocialMediaSummary.facebookImpressions,
                    score: data.reportSocialMediaSummary.facebookScore
                },
                twitter: {
                    retweets: data.reportSocialMediaSummary.xRetweets,
                    replies: data.reportSocialMediaSummary.xReplies,
                    likes: data.reportSocialMediaSummary.xLikes,
                    impressions: data.reportSocialMediaSummary.xImpressions,
                    score: data.reportSocialMediaSummary.xScore
                }
            },
            attractionCategories: data.attractionCategories.map(category => ({
                categoryId: category.attractionCategoryId,
                categoryName: category.attractionCategoryName,
                totalAttraction: category.totalAttraction,
                totalXPost: category.totalXPost,
                totalFacebookPost: category.totalFacebookPost,
                averageScore: category.averageScore,
                averageFacebookScore: category.averageFacebookScore,
                averageXScore: category.averageXScore,
                averageAttractionScore: category.averageAttractionScore
            })),
            tourCategories: data.tourTemplateCategories.map(category => ({
                categoryId: category.tourCategoryId,
                categoryName: category.tourCategoryName,
                totalTourTemplate: category.totalTourTemplate,
                totalXPost: category.totalXPost,
                totalFacebookPost: category.totalFacebookPost,
                averageScore: category.averageScore,
                averageFacebookScore: category.averageFacebookScore,
                averageXScore: category.averageXScore,
                averageTourTemplateScore: category.averageTourTemplateScore
            })),
            postCategories: data.postCategories.map(category => ({
                categoryId: category.postCategoryId,
                categoryName: category.postCategoryName,
                totalSitePost: category.totalSitePost,
                totalXPost: category.totalXPost,
                totalFacebookPost: category.totalFacebookPost,
                averageScore: category.averageScore,
                averageFacebookScore: category.averageFacebookScore,
                averageXScore: category.averageXScore,
                averageSitePostScore: category.averageSitePostScore
            }))
        };
    } catch (error) {
        console.error('Error fetching social media province detail:', error);
        throw error;
    }
};

export const fetchSocialMediaAttractionCategoryDetail = async (categoryId, startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/social-media-attraction-category-detail/${categoryId}?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return {
            categoryId: data.attractionCategoryId,
            categoryName: data.attractionCategoryName,
            totalAttraction: data.totalAttraction,
            totalXPost: data.totalXPost,
            totalFacebookPost: data.totalFacebookPost,
            averageScore: data.averageScore,
            averageFacebookScore: data.averageFacebookScore,
            averageXScore: data.averageXScore,
            averageAttractionScore: data.averageAttractionScore,
            socialMediaSummary: {
                dates: data.reportSocialMediaSummary.dates,
                facebook: {
                    comments: data.reportSocialMediaSummary.facebookComments,
                    shares: data.reportSocialMediaSummary.facebookShares,
                    reactions: data.reportSocialMediaSummary.facebookReactions,
                    impressions: data.reportSocialMediaSummary.facebookImpressions,
                    score: data.reportSocialMediaSummary.facebookScore
                },
                twitter: {
                    retweets: data.reportSocialMediaSummary.xRetweets,
                    replies: data.reportSocialMediaSummary.xReplies,
                    likes: data.reportSocialMediaSummary.xLikes,
                    impressions: data.reportSocialMediaSummary.xImpressions,
                    score: data.reportSocialMediaSummary.xScore
                }
            },
            provinces: data.provinces.map(province => ({
                provinceId: province.provinceId,
                provinceName: province.provinceName,
                totalAttraction: province.totalAttraction,
                totalXPost: province.totalXPost,
                totalFacebookPost: province.totalFacebookPost,
                averageScore: province.averageScore,
                averageFacebookScore: province.averageFacebookScore,
                averageXScore: province.averageXScore,
                averageAttractionScore: province.averageAttractionScore
            }))
        };
    } catch (error) {
        console.error('Error fetching social media attraction category detail:', error);
        throw error;
    }
};

export const fetchSocialMediaPostCategoryDetail = async (categoryId, startDate, endDate) => {
    const token = getCookie('token');
    console.log(token);
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/social-media-post-category-detail/${categoryId}?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return {
            categoryId: data.postCategoryId,
            categoryName: data.postCategoryName,
            totalSitePost: data.totalSitePost,
            totalXPost: data.totalXPost,
            totalFacebookPost: data.totalFacebookPost,
            averageScore: data.averageScore,
            averageFacebookScore: data.averageFacebookScore,
            averageXScore: data.averageXScore,
            averageSitePostScore: data.averageSitePostScore,
            socialMediaSummary: {
                dates: data.reportSocialMediaSummary.dates,
                facebook: {
                    comments: data.reportSocialMediaSummary.facebookComments,
                    shares: data.reportSocialMediaSummary.facebookShares,
                    reactions: data.reportSocialMediaSummary.facebookReactions,
                    impressions: data.reportSocialMediaSummary.facebookImpressions,
                    score: data.reportSocialMediaSummary.facebookScore
                },
                twitter: {
                    retweets: data.reportSocialMediaSummary.xRetweets,
                    replies: data.reportSocialMediaSummary.xReplies,
                    likes: data.reportSocialMediaSummary.xLikes,
                    impressions: data.reportSocialMediaSummary.xImpressions,
                    score: data.reportSocialMediaSummary.xScore
                }
            },
            provinces: data.provinces.map(province => ({
                provinceId: province.provinceId,
                provinceName: province.provinceName,
                totalSitePost: province.totalSitePost,
                totalXPost: province.totalXPost,
                totalFacebookPost: province.totalFacebookPost,
                averageScore: province.averageScore,
                averageFacebookScore: province.averageFacebookScore,
                averageXScore: province.averageXScore,
                averageSitePostScore: province.averageSitePostScore
            }))
        };
    } catch (error) {
        console.error('Error fetching social media post category detail:', error);
        throw error;
    }
};

export const fetchSocialMediaTourCategoryDetail = async (categoryId, startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/social-media-tour-category-detail/${categoryId}?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return {
            categoryId: data.tourCategoryId,
            categoryName: data.tourCategoryName,
            totalTourTemplate: data.totalTourTemplate,
            totalXPost: data.totalXPost,
            totalFacebookPost: data.totalFacebookPost,
            averageScore: data.averageScore,
            averageFacebookScore: data.averageFacebookScore,
            averageXScore: data.averageXScore,
            averageTourTemplateScore: data.averageTourTemplateScore,
            socialMediaSummary: {
                dates: data.reportSocialMediaSummary.dates,
                facebook: {
                    comments: data.reportSocialMediaSummary.facebookComments,
                    shares: data.reportSocialMediaSummary.facebookShares,
                    reactions: data.reportSocialMediaSummary.facebookReactions,
                    impressions: data.reportSocialMediaSummary.facebookImpressions,
                    score: data.reportSocialMediaSummary.facebookScore
                },
                twitter: {
                    retweets: data.reportSocialMediaSummary.xRetweets,
                    replies: data.reportSocialMediaSummary.xReplies,
                    likes: data.reportSocialMediaSummary.xLikes,
                    impressions: data.reportSocialMediaSummary.xImpressions,
                    score: data.reportSocialMediaSummary.xScore
                }
            },
            provinces: data.provinces.map(province => ({
                provinceId: province.provinceId,
                provinceName: province.provinceName,
                totalTourTemplate: province.totalTourTemplate,
                totalXPost: province.totalXPost,
                totalFacebookPost: province.totalFacebookPost,
                averageScore: province.averageScore,
                averageFacebookScore: province.averageFacebookScore,
                averageXScore: province.averageXScore,
                averageTourTemplateScore: province.averageTourTemplateScore
            }))
        };
    } catch (error) {
        console.error('Error fetching social media tour category detail:', error);
        throw error;
    }
};

export const fetchSocialMediaHashtag = async (startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        
        const response = await axios.get(`${baseURL}/api/reports/social-media-hashtag?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = response.data.data;
        return data.map(hashtag => ({
            hashtagId: hashtag.hashtagId,
            hashtagName: hashtag.hashtagName,
            totalXPost: hashtag.totalXPost,
            totalFacebookPost: hashtag.totalFacebookPost,
            averageScore: hashtag.averageScore,
            averageFacebookScore: hashtag.averageFacebookScore,
            averageXScore: hashtag.averageXScore,
            facebookCTR: hashtag.facebookCTR,
            xctr: hashtag.xctr
        }));
    } catch (error) {
        console.error('Error fetching social media hashtag:', error);
        throw error;
    }
};

export const fetchSocialMediaHashtagDetail = async (hashtagId, startDate, endDate) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await axios.get(`${baseURL}/api/reports/social-media-hashtag-detail/${hashtagId}?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data.data;
        return {
            hashtagId: data.hashtagId,
            hashtagName: data.hashtagName,
            totalXPost: data.totalXPost,
            totalFacebookPost: data.totalFacebookPost,
            averageScore: data.averageScore,
            averageFacebookScore: data.averageFacebookScore,
            averageXScore: data.averageXScore,
            facebookCTR: data.facebookCTR,
            xctr: data.xctr,
            socialMediaSummary: {
                dates: data.reportSocialMediaSummary.dates,
                facebook: {
                    comments: data.reportSocialMediaSummary.facebookComments,
                    shares: data.reportSocialMediaSummary.facebookShares,
                    reactions: data.reportSocialMediaSummary.facebookReactions,
                    impressions: data.reportSocialMediaSummary.facebookImpressions,
                    score: data.reportSocialMediaSummary.facebookScore
                },
                twitter: {
                    retweets: data.reportSocialMediaSummary.xRetweets,
                    replies: data.reportSocialMediaSummary.xReplies,
                    likes: data.reportSocialMediaSummary.xLikes,
                    impressions: data.reportSocialMediaSummary.xImpressions,
                    score: data.reportSocialMediaSummary.xScore
                }
            }
        };
    } catch (error) {
        console.error('Error fetching social media hashtag detail:', error);
        throw error;
    }
};