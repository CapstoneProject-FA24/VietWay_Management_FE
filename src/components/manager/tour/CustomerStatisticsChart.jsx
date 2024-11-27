import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';

// Mock data - replace with actual API data later
const mockCustomerData = [
    { period: '01/2024', bookings: 12, participants: 40, reviews: 5 },
    { period: '02/2024', bookings: 50, participants: 90, reviews: 35 },
    { period: '03/2024', bookings: 8, participants: 22, reviews: 3 },
    { period: '04/2024', bookings: 30, participants: 70, reviews: 18 },
    { period: '05/2024', bookings: 45, participants: 85, reviews: 28 },
    { period: '06/2024', bookings: 18, participants: 50, reviews: 12 },
    { period: '07/2024', bookings: 60, participants: 110, reviews: 40 }
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const bookings = payload[0]?.value || 0;
        const participants = payload[1]?.value || 0;
        const reviews = payload[2]?.value || 0;
        const reviewRate = ((reviews / bookings) * 100).toFixed(1);
        const avgParticipants = (participants / bookings).toFixed(1);
        
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
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Trung bình {avgParticipants} người/booking
                </Typography>
                <Typography variant="body2">
                    Tỷ lệ đánh giá: {reviewRate}%
                </Typography>
            </Paper>
        );
    }
    return null;
};

const CustomerStatisticsChart = ({ dateRange }) => {
    const filteredData = mockCustomerData.filter(item => {
        const itemDate = dayjs(item.period, 'MM/YYYY');
        return (itemDate.isAfter(dateRange.startDate, 'month') || 
                itemDate.isSame(dateRange.startDate, 'month')) &&
               (itemDate.isBefore(dateRange.endDate, 'month') || 
                itemDate.isSame(dateRange.endDate, 'month'));
    });

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 550 }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
                Thống kê khách hàng
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    data={filteredData}
                    margin={{ top: 20, right: 5, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                        dataKey="bookings" 
                        name="Số lượng đặt" 
                        fill="#2196f3" 
                    />
                    <Bar 
                        dataKey="participants" 
                        name="Số người tham gia" 
                        fill="#4caf50" 
                    />
                    <Bar 
                        dataKey="reviews" 
                        name="Số đánh giá" 
                        fill="#ff9800" 
                    />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default CustomerStatisticsChart;
