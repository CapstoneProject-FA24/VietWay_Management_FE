import axios from 'axios';
import baseURL from '@api/BaseURL';
import dayjs from 'dayjs';

export const fetchToursByTemplateId = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/api/tours/get-tours-by-template-id?tourTemplateId=${id}`);
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

export const fetchTours = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/tours?pageSize=100&pageIndex=1`);
        const tours = response.data.data.items.map(item => ({
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
            .minute(tourData.startTime.minute());

        const formattedData = {
            tourTemplateId: tourData.tourTemplateId,
            startLocation: tourData.startAddress,
            startDate: startDateTime.toISOString(),
            defaultTouristPrice: parseFloat(tourData.adultPrice),
            registerOpenDate: tourData.registerOpenDate.toISOString(),
            registerCloseDate: tourData.registerCloseDate.toISOString(),
            maxParticipant: parseInt(tourData.maxParticipants),
            minParticipant: parseInt(tourData.minParticipants),
            currentParticipant: 0,
            createdAt: new Date().toISOString(),
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
            refundPolicies: [
                {
                    cancelBefore: startDateTime.subtract(1, 'day').toISOString(),
                    refundPercent: 100
                },
                {
                    cancelBefore: startDateTime.subtract(3, 'day').toISOString(),
                    refundPercent: 50
                }
            ]
        };

        const response = await axios.post(`${baseURL}/api/tours`, formattedData);
        return response.data;
    } catch (error) {
        console.error('Error creating tour:', error);
        throw error;
    }
};