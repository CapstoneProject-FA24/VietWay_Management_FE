import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
import { getCookie } from '@services/AuthenService';

export const getBookings = async (pageCount, pageIndex, bookingIdSearch, contactNameSearch, contactPhoneSearch, bookingStatus, tourIdSearch) => {
    try {
        const response = await axios.get(`${baseURL}/api/booking`, {
            params: {
                pageCount,
                pageIndex,
                bookingIdSearch,
                contactNameSearch,
                contactPhoneSearch,
                bookingStatus,
                tourIdSearch
            },
            headers: {
                'Authorization': `Bearer ${getCookie('token')}`
            }
        });
        
        const { items, total, pageSize, pageIndex: currentPage } = response.data.data;
        return {
            items: items.map(booking => ({
                bookingId: booking.bookingId,
                tourId: booking.tourId,
                tourName: booking.tourName,
                tourCode: booking.tourCode,
                duration: booking.duration,
                provinces: booking.provinces,
                startDate: booking.startDate,
                startLocation: booking.startLocation,
                createdAt: booking.createdAt,
                contactFullName: booking.contactFullName,
                contactEmail: booking.contactEmail,
                contactPhoneNumber: booking.contactPhoneNumber,
                totalPrice: booking.totalPrice,
                paidAmount: booking.paidAmount,
                numberOfParticipants: booking.numberOfParticipants,
                status: booking.status,
                havePendingRefund: booking.havePendingRefund,
                tourists: booking.tourists.map(tourist => ({
                    touristId: tourist.touristId,
                    fullName: tourist.fullName,
                    dateOfBirth: tourist.dateOfBirth,
                    pin: tourist.pin
                }))
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

export const createRefundTransaction = async (refundId, refundData) => {
    try {
        const response = await axios.post(
            `${baseURL}/api/booking-refunds/${refundId}/refund`,
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
            duration: booking.duration,
            transportation: booking.transportation,
            tourCode: booking.tourCode,
            startDate: booking.startDate,
            startLocation: booking.startLocation,
            createdAt: booking.createdAt,
            contactFullName: booking.contactFullName,
            contactEmail: booking.contactEmail,
            contactPhoneNumber: booking.contactPhoneNumber,
            contactAddress: booking.contactAddress,
            totalPrice: booking.totalPrice,
            paidAmount: booking.paidAmount,
            numberOfParticipants: booking.numberOfParticipants,
            status: booking.status,
            note: booking.note,
            refundRequests: booking.refundRequests.map(refund => ({
                refundId: refund.refundId,
                bookingId: refund.bookingId,
                refundAmount: refund.refundAmount,
                refundStatus: refund.refundStatus,
                refundDate: refund.refundDate,
                refundReason: refund.refundReason,
                refundNote: refund.refundNote,
                bankCode: refund.bankCode,
                bankTransactionNumber: refund.bankTransactionNumber,
                createdAt: refund.createdAt
            })),
            tourists: booking.tourists.map(tourist => ({
                touristId: tourist.touristId,
                fullName: tourist.fullName,
                gender: tourist.gender,
                phoneNumber: tourist.phoneNumber,
                dateOfBirth: tourist.dateOfBirth,
                price: tourist.price,
                pin: tourist.pin
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

export const cancelBooking = async (bookingId, reason) => {
    try {
        const response = await axios.patch(
            `${baseURL}/api/booking/${bookingId}`, 
            { reason },
            {
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error canceling booking:', error.response);
        throw error;
    }
};


export const changeBookingTour = async (bookingId, newTourId, reason) => {
    try {
        const response = await axios.put(
            `${baseURL}/api/booking/${bookingId}/change-booking-tour`,
            { newTourId, reason },
            {
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error changing booking tour:', error.response);
        throw error;
    }
};

export const getBookingHistory = async (bookingId) => {
    try {
        const response = await axios.get(
            `${baseURL}/api/booking/${bookingId}/history`,
            {
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            }
        );
        return response.data.data.map(history => ({
            modifierRole: history.modifierRole,
            reason: history.reason,
            action: history.action,
            timestamp: history.timestamp,
            oldStatus: history.oldStatus,
            newStatus: history.newStatus
        }));
    } catch (error) {
        console.error('Error fetching booking history:', error.response);
        throw error;
    }
};