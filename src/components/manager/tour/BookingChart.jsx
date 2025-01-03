import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BookingStatus } from '@hooks/Statuses';
import { getBookingStatusInfo } from '@services/StatusService';
import { Box, Paper, Typography } from '@mui/material';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const total = payload.reduce((sum, entry) => sum + entry.value, 0);
        
        return (
            <Paper sx={{ p: 1, backgroundColor: 'white' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>{label}</strong>
                </Typography>
                {payload.map((entry, index) => (
                    <Typography 
                        key={index} 
                        variant="body2" 
                        sx={{ color: entry.color }}
                    >
                        {entry.name}: {entry.value}
                    </Typography>
                ))}
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Tổng: {total}
                </Typography>
            </Paper>
        );
    }
    return null;
};

const BookingChart = ({ bookingData }) => {
    // Transform data for the chart
    const transformedData = bookingData.dates.map((date, index) => ({
        period: date,
        pending: bookingData.pendingBookings[index],
        deposited: bookingData.depositedBookings[index],
        paid: bookingData.paidBookings[index],
        completed: bookingData.completedBookings[index],
        cancelled: bookingData.cancelledBookings[index]
    }));

    // Define colors and labels for each status
    const statusConfig = [
        { key: 'pending', label: 'Chờ xác nhận', color: '#ff7300' },
        { key: 'deposited', label: 'Đã đặt cọc', color: '#2196f3' },
        { key: 'paid', label: 'Đã thanh toán', color: '#4caf50' },
        { key: 'completed', label: 'Đã hoàn thành', color: '#9c27b0' },
        { key: 'cancelled', label: 'Đã hủy', color: '#f44336' }
    ];

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 550 }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
                Thống kê số lượng booking
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    data={transformedData}
                    margin={{ top: 20, right: 5, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {statusConfig.map(status => (
                        <Bar
                            key={status.key}
                            dataKey={status.key}
                            name={status.label}
                            fill={status.color}
                            stackId="status"
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default BookingChart;
