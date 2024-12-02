import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import dayjs from 'dayjs';
import { getCookie } from '@services/AuthenService';

export const fetchToursByTemplateId = async (id) => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/tours/get-by-template-id/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        const tours = response.data.data.map(item => ({
            id: item.tourId,
            tourTemplateId: item.tourTemplateId,
            startLocation: item.startLocation,
            startTime: new Date(item.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            startDate: new Date(item.startDate),
            defaultTouristPrice: item.defaultTouristPrice,
            maxParticipant: item.maxParticipant,
            minParticipant: item.minParticipant,
            currentParticipant: item.currentParticipant,
            status: item.status,
            registerOpenDate: new Date(item.registerOpenDate),
            registerCloseDate: new Date(item.registerCloseDate),
            createdAt: new Date(item.createdAt),
            totalBookings: item.totalBookings,
            tourPolicies: item.tourPolicies.map(policy => ({
                cancelBefore: new Date(policy.cancelBefore),
                refundPercent: policy.refundPercent
            })),
            tourPrices: item.tourPrices.map(price => ({
                priceId: price.priceId,
                name: price.name,
                price: price.price,
                ageFrom: price.ageFrom,
                ageTo: price.ageTo
            }))
        }));
        return tours;
    } catch (error) {
        console.error('Error fetching tour:', error);
        throw error;
    }
};

export const fetchTours = async ({ params }) => {
    const token = getCookie('token');
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('sortBy', 'createdAt');
        queryParams.append('sortDirection', 'desc');
        queryParams.append('pageSize', params.pageSize);
        queryParams.append('pageIndex', params.pageIndex);
        if (params.searchTerm) queryParams.append('nameSearch', params.searchTerm);
        if (params.searchCodeTerm) queryParams.append('codeSearch', params.searchCodeTerm);
        if (params.templateCategoryIds?.length > 0) params.templateCategoryIds.forEach(id => queryParams.append('tourCategoryIds', id));
        if (params.durationIds?.length > 0) params.durationIds.forEach(id => queryParams.append('durationIds', id));
        if (params.provinceIds?.length > 0) params.provinceIds.forEach(id => queryParams.append('provinceIds', id));
        if (params.status !== undefined && params.status !== null) queryParams.append('status', params.status);
        if (params.startDateFrom) queryParams.append('startDateFrom', params.startDateFrom);
        if (params.startDateTo) queryParams.append('startDateTo', params.startDateTo);

        const response = await axios.get(`${baseURL}/api/tours?${queryParams}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        const tours = response.data.data.items.map(item => ({
            id: item.tourId,
            tourTemplateId: item.tourTemplateId,
            code: item.code,
            tourName: item.tourName,
            duration: item.duration,
            imageUrl: item.imageUrl,
            startLocation: item.startLocation,
            startTime: new Date(item.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            startDate: new Date(item.startDate),
            defaultTouristPrice: item.defaultTouristPrice,
            maxParticipant: item.maxParticipant,
            minParticipant: item.minParticipant,
            currentParticipant: item.currentParticipant,
            status: item.status,
            createdAt: new Date(item.createdAt)
        }));

        return {
            data: tours,
            pageIndex: response.data.data.pageIndex,
            pageSize: response.data.data.pageSize,
            total: response.data.data.total
        };
    } catch (error) {
        console.error('Error fetching tour:', error);
        throw error;
    }
};

export const fetchTourById = async (id) => {
    const token = getCookie('token');
    try {
        const response = await axios.get(`${baseURL}/api/tours/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        const item = response.data.data;
        const tour = {
            id: item.tourId,
            tourTemplateId: item.tourTemplateId,
            startLocation: item.startLocation,
            startTime: new Date(item.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            startDate: new Date(item.startDate),
            defaultTouristPrice: item.defaultTouristPrice,
            maxParticipant: item.maxParticipant,
            minParticipant: item.minParticipant,
            currentParticipant: item.currentParticipant,
            status: item.status,
            registerOpenDate: new Date(item.registerOpenDate),
            registerCloseDate: new Date(item.registerCloseDate),
            createdAt: new Date(item.createdAt),
            totalBookings: item.totalBookings,
            tourPolicies: item.tourPolicies.map(policy => ({
                cancelBefore: new Date(policy.cancelBefore),
                refundPercent: policy.refundPercent
            })),
            tourPrices: item.tourPrices.map(price => ({
                priceId: price.priceId,
                name: price.name,
                price: price.price,
                ageFrom: price.ageFrom,
                ageTo: price.ageTo
            })),
            depositPercent: item.depositPercent,
            paymentDeadline: new Date(item.paymentDeadline),
        };
        return tour;
    } catch (error) {
        console.error('Error fetching tour:', error);
        throw error;
    }
};

export const calculateEndDate = (startDate, startTime, duration) => {
    if (!startDate || !startTime || !duration || !duration.durationName) return null;
    try {
        const durationStr = duration.durationName;
        const nights = parseInt(durationStr.match(/\d+(?=\s*đêm)/)?.[0] || 0);
        const days = parseInt(durationStr.match(/\d+(?=\s*ngày)/)?.[0] || 0);

        if (isNaN(nights) || isNaN(days)) {
            console.error('Could not parse duration:', durationStr);
            return null;
        }

        let totalDuration;
        let recommendationMessage = '';

        if (days > nights) {
            totalDuration = days - 1;
        } else if (days === nights) {
            totalDuration = days;
        } else {
            totalDuration = days;
        }
        
        // Parse startTime string into hours and minutes
        const [hours, minutes] = startTime.split(':').map(Number);
        
        const startDateTime = dayjs(startDate)
            .hour(hours)
            .minute(minutes);

        return {
            endDate: startDateTime.add(totalDuration, 'day'),
            recommendationMessage
        };
    } catch (error) {
        console.error('Error calculating end date:', error);
        return null;
    }
};

export const createTour = async (tourData) => {
    const token = getCookie('token');
    try {
        const startDateTime = dayjs(tourData.startDate)
            .hour(tourData.startTime.hour())
            .minute(tourData.startTime.minute())
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        const formattedData = {
            tourTemplateId: tourData.tourTemplateId,
            startLocation: tourData.startAddress,
            startLocationPlaceId: tourData.startLocationPlaceId,
            startDate: startDateTime,
            defaultTouristPrice: parseFloat(tourData.adultPrice),
            registerOpenDate: dayjs(tourData.registerOpenDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            registerCloseDate: dayjs(tourData.registerCloseDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            maxParticipant: parseInt(tourData.maxParticipants),
            minParticipant: parseInt(tourData.minParticipants),
            currentParticipant: 0,
            tourPrice: tourData.tourPrices,
            depositPercent: tourData.depositPercent,
            refundPolicies: tourData.refundPolicies.map(policy => ({
                cancelBefore: dayjs(policy.cancelBefore).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                refundPercent: Number(policy.refundRate)
            })),
            paymentDeadline: tourData.paymentDeadline,
        };

        console.log(formattedData);

        const response = await axios.post(`${baseURL}/api/tours`, formattedData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error creating tour:', error);
        throw error;
    }
};

export const updateTourStatus = async (tourId, status, reason) => {
    const token = getCookie('token');
    try {
        const response = await axios.patch(`${baseURL}/api/tours/change-tour-status/${tourId}`, {
            status,
            reason
        },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error updating tour status:', error);
        throw error;
    }
};

export const updateTour = async (tourId, tourData) => {
    const token = getCookie('token');
    try {
        const startDateTime = dayjs(tourData.startDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        const formattedData = {
            startLocation: tourData.startAddress,
            startDate: startDateTime,
            defaultTouristPrice: parseFloat(tourData.adultPrice),
            registerOpenDate: dayjs(tourData.registerOpenDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            registerCloseDate: dayjs(tourData.registerCloseDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            maxParticipant: parseInt(tourData.maxParticipants),
            minParticipant: parseInt(tourData.minParticipants),
            tourPrice: tourData.tourPrices.map(price => ({
                name: price.name,
                price: parseFloat(price.price),
                ageFrom: parseInt(price.ageFrom),
                ageTo: parseInt(price.ageTo)
            })),
            refundPolicies: tourData.refundPolicies.map(policy => ({
                cancelBefore: dayjs(policy.cancelBefore).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                refundPercent: Number(policy.refundRate)
            })),
            depositPercent: tourData.depositPercent,
            paymentDeadline: tourData.paymentDeadline,
        };

        const response = await axios.put(`${baseURL}/api/tours/edit-tour/${tourId}`, formattedData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error updating tour:', error);
        throw error;
    }
};


export const cancelTour = async (tourId, reason) => {
    const token = getCookie('token');
    try {
        const response = await axios.patch(`${baseURL}/api/tours/cancel-tour/${tourId}`, 
            { reason },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error canceling tour:', error);
        throw error;
    }
};
