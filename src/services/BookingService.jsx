import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const getBookings = async (pageCount, pageIndex, bookingIdSearch, contactNameSearch, contactPhoneSearch, bookingStatus, tourId) => {
    try {
        const response = await axios.get(`${baseURL}/api/booking`, {
            params: {
                pageCount,
                pageIndex,
                bookingIdSearch,
                contactNameSearch,
                contactPhoneSearch,
                bookingStatus,
                tourId
            },
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            }
        });
        
        const { items, total, pageSize, pageIndex: currentPage } = response.data.data;
        return {
            items: items.map(booking => ({
                bookingId: booking.bookingId,
                tourName: booking.tourName,
                tourCode: booking.tourCode,
                startDate: booking.startDate,
                startLocation: booking.startLocation,
                createdAt: booking.createdAt,
                contactFullName: booking.contactFullName,
                contactEmail: booking.contactEmail,
                contactPhoneNumber: booking.contactPhoneNumber,
                totalPrice: booking.totalPrice,
                numberOfParticipants: booking.numberOfParticipants,
                status: booking.status
            })),
            total,
            pageSize,
            currentPage
        };
    } catch (error) {
        console.error('Error fetching bookings:', error.response);
        throw error;
    }
};

export const createRefundTransaction = async (bookingId, refundData) => {
    try {
        const response = await axios.post(
            `${baseURL}/api/booking/${bookingId}/create-refund-transaction`,
            {
                note: refundData.note,
                bankCode: refundData.bankCode,
                bankTransactionNumber: refundData.bankTransactionNumber,
                payTime: refundData.payTime
            },
            {
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating refund transaction:', error.response);
        throw error;
    }
};

export const fetchBookingById = async (bookingId) => {
    try {
        const response = await axios.get(
            `${baseURL}/api/booking/${bookingId}`,
            {
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            }
        );

        const booking = response.data.data;
        return {
            bookingId: booking.bookingId,
            tourId: booking.tourId,
            tourName: booking.tourName,
            tourCode: booking.tourCode,
            startDate: booking.startDate,
            startLocation: booking.startLocation,
            createdAt: booking.createdAt,
            contactFullName: booking.contactFullName,
            contactEmail: booking.contactEmail,
            contactPhoneNumber: booking.contactPhoneNumber,
            contactAddress: booking.contactAddress,
            totalPrice: booking.totalPrice,
            numberOfParticipants: booking.numberOfParticipants,
            status: booking.status,
            note: booking.note,
            tourists: booking.tourists.map(tourist => ({
                touristId: tourist.touristId,
                fullName: tourist.fullName,
                gender: tourist.gender,
                phoneNumber: tourist.phoneNumber,
                dateOfBirth: tourist.dateOfBirth,
                price: tourist.price
            })),
            payments: booking.payments.map(payment => ({
                paymentId: payment.paymentId,
                amount: payment.amount,
                note: payment.note,
                createAt: payment.createAt,
                bankCode: payment.bankCode,
                bankTransactionNumber: payment.bankTransactionNumber,
                payTime: payment.payTime,
                thirdPartyTransactionNumber: payment.thirdPartyTransactionNumber,
                status: payment.status
            })),
            refundAmount: booking.refundAmount,
            cancelAt: booking.cancelAt,
            cancelBy: booking.cancelBy,
            tourPolicies: booking.tourPolicies.map(policy => ({
                cancelBefore: policy.cancelBefore,
                refundPercent: policy.refundPercent
            }))
        };
    } catch (error) {
        console.error('Error fetching booking:', error.response);
        throw error;
    }
};