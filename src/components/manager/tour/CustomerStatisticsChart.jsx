import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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

const CustomerStatisticsChart = () => {
    const [dateRange, setDateRange] = React.useState({
        startDate: dayjs().subtract(6, 'month'),
        endDate: dayjs()
    });

    const [appliedDateRange, setAppliedDateRange] = React.useState({
        startDate: dayjs().subtract(6, 'month'),
        endDate: dayjs()
    });

    const handleStartDateChange = (newValue) => {
        setDateRange(prev => ({
            ...prev,
            startDate: newValue,
            endDate: newValue.isAfter(prev.endDate) ? newValue : prev.endDate
        }));
    };

    const handleEndDateChange = (newValue) => {
        setDateRange(prev => ({
            ...prev,
            endDate: newValue
        }));
    };

    const handleApply = () => {
        setAppliedDateRange(dateRange);
    };

    const filteredData = mockCustomerData.filter(item => {
        const itemDate = dayjs(item.period, 'MM/YYYY');
        return (itemDate.isAfter(appliedDateRange.startDate, 'month') || itemDate.isSame(appliedDateRange.startDate, 'month')) &&
            (itemDate.isBefore(appliedDateRange.endDate, 'month') || itemDate.isSame(appliedDateRange.endDate, 'month'));
    });

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 550 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    Thống kê khách hàng đặt, tham gia và đánh giá tour
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 2 }}>

                    <DatePicker
                        views={['month', 'year']}
                        value={dateRange.startDate}
                        onChange={handleStartDateChange}
                        maxDate={dateRange.endDate}
                        slotProps={{ textField: { size: 'small' } }}
                        label="Từ tháng"
                        format="MM/YYYY"
                        sx={{ width: 150 }}
                    />
                    <DatePicker
                        views={['month', 'year']}
                        value={dateRange.endDate}
                        onChange={handleEndDateChange}
                        minDate={dateRange.startDate}
                        maxDate={dayjs()}
                        slotProps={{ textField: { size: 'small' } }}
                        label="Đến tháng"
                        format="MM/YYYY"
                        sx={{ width: 150 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleApply}
                        sx={{ height: 40 }}
                    >
                        Áp dụng
                    </Button>
                </Box>
            </LocalizationProvider>
            <ResponsiveContainer width="100%" height="72%">
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
