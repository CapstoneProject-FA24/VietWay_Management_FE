import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Paper, Typography, Button, ButtonGroup, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Mock data - replace with actual API data later
const mockRevenueData = [
    {
        templateName: 'Hạ Long Bay 2N1Đ',
        totalRevenue: 565000000,
        averageRevenue: 5000000,
        monthlyData: {
            '01/2024': { revenue: 125000000, bookings: 25 },
            '02/2024': { revenue: 140000000, bookings: 28 },
            '03/2024': { revenue: 150000000, bookings: 30 },
        }
    },
    {
        templateName: 'Sapa 3N2Đ',
        totalRevenue: 480000000,
        averageRevenue: 6000000,
        monthlyData: {
            '01/2024': { revenue: 150000000, bookings: 25 },
            '02/2024': { revenue: 160000000, bookings: 27 },
            '03/2024': { revenue: 170000000, bookings: 28 },
        }
    },
    {
        templateName: 'Phú Quốc 4N3Đ',
        totalRevenue: 420000000,
        averageRevenue: 7000000,
        monthlyData: {
            '01/2024': { revenue: 130000000, bookings: 19 },
            '02/2024': { revenue: 140000000, bookings: 20 },
            '03/2024': { revenue: 150000000, bookings: 21 },
        }
    },
    {
        templateName: 'Đà Nẵng - Hội An 3N2Đ',
        totalRevenue: 390000000,
        averageRevenue: 4500000,
        monthlyData: {
            '01/2024': { revenue: 120000000, bookings: 27 },
            '02/2024': { revenue: 130000000, bookings: 29 },
            '03/2024': { revenue: 140000000, bookings: 31 },
        }
    },
    {
        templateName: 'Nha Trang 3N2Đ',
        totalRevenue: 350000000,
        averageRevenue: 5000000,
        monthlyData: {
            '01/2024': { revenue: 110000000, bookings: 22 },
            '02/2024': { revenue: 120000000, bookings: 24 },
            '03/2024': { revenue: 120000000, bookings: 24 },
        }
    },
    {
        templateName: 'Bến Tre 3N2Đ',
        totalRevenue: 350000000,
        averageRevenue: 5000000,
        monthlyData: {
            '01/2024': { revenue: 110000000, bookings: 22 },
            '02/2024': { revenue: 120000000, bookings: 24 },
            '03/2024': { revenue: 120000000, bookings: 24 },
        }
    }
].sort((a, b) => b.totalRevenue - a.totalRevenue);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0]?.payload;
        const monthlyData = Object.values(data.monthlyData);
        const totalBookings = monthlyData.reduce((sum, month) => sum + month.bookings, 0);
        const totalParticipants = monthlyData.reduce((sum, month) => sum + (month.participants || month.bookings * 4), 0);
        
        return (
            <Paper sx={{ p: 1, backgroundColor: 'white' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>{label}</strong>
                </Typography>
                <Typography variant="body2" color="primary">
                    Tổng doanh thu: {data.totalRevenue.toLocaleString('vi-VN')}đ
                </Typography>
                <Typography variant="body2" color="success.main">
                    Trung bình/booking: {data.averageRevenue.toLocaleString('vi-VN')}đ
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                    Số lượng booking: {totalBookings}
                </Typography>
                <Typography variant="body2">
                    Số người tham gia: {totalParticipants}
                </Typography>
                <Typography variant="body2">
                    Trung bình: {(totalParticipants / totalBookings).toFixed(1)} người/booking
                </Typography>
            </Paper>
        );
    }
    return null;
};

const TourTemplateRevenue = () => {
    const [displayCount, setDisplayCount] = useState(5);
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().subtract(6, 'month'),
        endDate: dayjs()
    });
    const [appliedDateRange, setAppliedDateRange] = useState({
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

    const filteredData = mockRevenueData.slice(0, displayCount);

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography sx={{ fontSize: '1.3rem', fontWeight: 600 }}>
                        Thống kê doanh thu theo tour
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                        Sắp xếp theo tổng doanh thu
                    </Typography> */}
                </Box>
                <ButtonGroup size="small" variant="outlined">
                    <Button
                        onClick={() => setDisplayCount(5)}
                        variant={displayCount === 5 ? 'contained' : 'outlined'}
                    >
                        Top 5
                    </Button>
                    <Button
                        onClick={() => setDisplayCount(10)}
                        variant={displayCount === 10 ? 'contained' : 'outlined'}
                    >
                        Top 10
                    </Button>
                    <Button
                        onClick={() => setDisplayCount(mockRevenueData.length)}
                        variant={displayCount === mockRevenueData.length ? 'contained' : 'outlined'}
                    >
                        Tất cả
                    </Button>
                </ButtonGroup>
            </Box>

            {/* Date picker section */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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

            {/* Chart section */}
            <Box sx={{
                height: displayCount <= 5 ? '250px' :
                    displayCount <= 10 ? '350px' : '700px',
                transition: 'height 0.3s ease-in-out'
            }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={filteredData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}Triệu`} />
                        <YAxis
                            type="category"
                            dataKey="templateName"
                            width={150}
                            tickFormatter={(value) => {
                                const maxLength = 45;
                                return value.length <= maxLength ? value : value.slice(0, maxLength) + '...';
                            }}
                            tick={{ 
                                width: 170,
                                fontSize: 12.5,
                                wordWrap: 'break-word'
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="totalRevenue" name="Tổng doanh thu" fill="#2196f3" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default TourTemplateRevenue;
