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
