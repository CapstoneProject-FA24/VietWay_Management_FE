import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import dayjs from 'dayjs';

export const fetchToursByTemplateId = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/tours/get-by-template-id/${id}`);
        const tours = response.data.data.map(item => ({
            id: item.tourId,
            tourTemplateId: item.tourTemplateId,
            startLocation: item.startLocation,
            startTime: new Date(item.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            startDate: new Date(item.startDate),
            price: item.price,
            maxParticipant: item.maxParticipant,
            minParticipant: item.minParticipant,
            currentParticipant: item.currentParticipant,
            status: item.status
        }));
        return tours;
    } catch (error) {
        console.error('Error fetching tour:', error);
        throw error;
    }
};

export const fetchTours = async ({params}) => {
    try {
        const queryParams = new URLSearchParams();
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

        const response = await axios.get(`${baseURL}/api/tours?${queryParams}`);
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
            price: item.defaultTouristPrice,
            maxParticipant: item.maxParticipant,
            minParticipant: item.minParticipant,
            currentParticipant: item.currentParticipant,
            status: item.status
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
    try {
        const response = await axios.get(`${baseURL}/api/tours/${id}`);
        const item = response.data.data;
        const tour = {
            id: item.tourId,
            tourTemplateId: item.tourTemplateId,
            startLocation: item.startLocation,
            startTime: new Date(item.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            startDate: new Date(item.startDate),
            price: item.price,
            maxParticipant: item.maxParticipant,
            minParticipant: item.minParticipant,
            currentParticipant: item.currentParticipant,
            status: item.status
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

        const startDateTime = dayjs(startDate)
            .hour(startTime.hour())
            .minute(startTime.minute());

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
    try {
        const startDateTime = dayjs(tourData.startDate)
            .hour(tourData.startTime.hour())
            .minute(tourData.startTime.minute())
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        const formattedData = {
            tourTemplateId: tourData.tourTemplateId,
            startLocation: tourData.startAddress,
            startDate: startDateTime,
            defaultTouristPrice: parseFloat(tourData.adultPrice),
            registerOpenDate: dayjs(tourData.registerOpenDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            registerCloseDate: dayjs(tourData.registerCloseDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            maxParticipant: parseInt(tourData.maxParticipants),
            minParticipant: parseInt(tourData.minParticipants),
            currentParticipant: 0,
            createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            tourPrices: [
                {
                    name: "Người lớn",
                    price: parseFloat(tourData.adultPrice),
                    ageFrom: 12,
                    ageTo: 200
                },
                {
                    name: "Trẻ em", 
                    price: parseFloat(tourData.childPrice),
                    ageFrom: 5,
                    ageTo: 11
                },
                {
                    name: "Em bé",
                    price: parseFloat(tourData.infantPrice),
                    ageFrom: 0,
                    ageTo: 4
                }
            ],
            refundPolicies: tourData.refundPolicies.map(policy => ({
                cancelBefore: dayjs(policy.cancelBefore).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                refundPercent: Number(policy.refundRate)
            }))
        };

        const response = await axios.post(`${baseURL}/api/tours`, formattedData);
        return response.data;
    } catch (error) {
        console.error('Error creating tour:', error);
        throw error;
    }
};