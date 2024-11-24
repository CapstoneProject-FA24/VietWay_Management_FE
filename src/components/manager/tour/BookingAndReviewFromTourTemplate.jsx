import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Paper, Typography, Button, ButtonGroup, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Mock data - replace with actual API data later
const mockTemplateData = [
    {
        templateName: 'Hà Nội - Tràng An - Đảo Kong',
        bookings: 88,
        participants: 352,
        reviews: 75,
        rating: 4.5,
        monthlyData: {
            '01/2024': { bookings: 15, participants: 60, reviews: 12, rating: 4.6 },
            '02/2024': { bookings: 18, participants: 72, reviews: 15, rating: 4.4 },
            '03/2024': { bookings: 20, participants: 80, reviews: 18, rating: 4.5 },
        }
    },
    {
        templateName: 'Hạ Long Bay 2N1Đ',
        bookings: 113,
        participants: 452,
        reviews: 95,
        rating: 4.7,
        monthlyData: {
            '01/2024': { bookings: 25, participants: 100, reviews: 22, rating: 4.8 },
            '02/2024': { bookings: 28, participants: 112, reviews: 24, rating: 4.7 },
            '03/2024': { bookings: 30, participants: 120, reviews: 26, rating: 4.6 },
        }
    },
    {
        templateName: 'Sapa Adventure Tour',
        bookings: 95,
        participants: 380,
        reviews: 82,
        rating: 4.6,
        monthlyData: {
            '01/2024': { bookings: 20, participants: 80, reviews: 18, rating: 4.5 },
            '02/2024': { bookings: 22, participants: 88, reviews: 19, rating: 4.6 },
            '03/2024': { bookings: 25, participants: 100, reviews: 21, rating: 4.7 },
        }
    },
    {
        templateName: 'Phú Quốc Island Paradise',
        bookings: 105,
        participants: 420,
        reviews: 90,
        rating: 4.8,
        monthlyData: {
            '01/2024': { bookings: 23, participants: 92, reviews: 20, rating: 4.8 },
            '02/2024': { bookings: 26, participants: 104, reviews: 22, rating: 4.7 },
            '03/2024': { bookings: 28, participants: 112, reviews: 24, rating: 4.9 },
        }
    },
    {
        templateName: 'Đà Nẵng - Hội An Heritage Tour',
        bookings: 98,
        participants: 392,
        reviews: 85,
        rating: 4.6,
        monthlyData: {
            '01/2024': { bookings: 21, participants: 84, reviews: 18, rating: 4.5 },
            '02/2024': { bookings: 24, participants: 96, reviews: 20, rating: 4.6 },
            '03/2024': { bookings: 26, participants: 104, reviews: 22, rating: 4.7 },
        }
    },
    {
        templateName: 'Mekong Delta Experience',
        bookings: 85,
        participants: 340,
        reviews: 72,
        rating: 4.4,
        monthlyData: {
            '01/2024': { bookings: 18, participants: 72, reviews: 15, rating: 4.3 },
            '02/2024': { bookings: 20, participants: 80, reviews: 17, rating: 4.4 },
            '03/2024': { bookings: 22, participants: 88, reviews: 19, rating: 4.5 },
        }
    },
    {
        templateName: 'Huế Imperial City Tour',
        bookings: 78,
        participants: 312,
        reviews: 65,
        rating: 4.5,
        monthlyData: {
            '01/2024': { bookings: 16, participants: 64, reviews: 14, rating: 4.4 },
            '02/2024': { bookings: 19, participants: 76, reviews: 16, rating: 4.5 },
            '03/2024': { bookings: 21, participants: 84, reviews: 18, rating: 4.6 },
        }
    }
].sort((a, b) => b.bookings - a.bookings);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0]?.payload;
        const reviewRate = ((data.reviews / data.bookings) * 100).toFixed(1);
        const avgParticipants = (data.participants / data.bookings).toFixed(1);

        return (
            <Paper sx={{ p: 1, backgroundColor: 'white' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>{label}</strong>
                </Typography>
                <Typography variant="body2" color="primary">
                    Số lượng đặt: {data.bookings}
                </Typography>
                <Typography variant="body2" color="success.main">
                    Số người tham gia: {data.participants}
                </Typography>
                <Typography variant="body2" color="warning.main">
                    Số đánh giá: {data.reviews}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                    Trung bình {avgParticipants} người/booking
                </Typography>
                <Typography variant="body2">
                    Tỷ lệ đánh giá: {reviewRate}%
                </Typography>
                <Typography variant="body2">
                    Điểm đánh giá: {data.rating.toFixed(1)}/5.0
                </Typography>
            </Paper>
        );
    }
    return null;
};

const BookingAndReviewFromTourTemplate = () => {
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

    const filteredData = mockTemplateData.slice(0, displayCount);

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography sx={{ fontSize: '1.3rem', fontWeight: 600 }}>
                        Số lượng booking, khách và đánh giá của các tour
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                        Sắp xếp theo số lượng đặt tour
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
                        onClick={() => setDisplayCount(mockTemplateData.length)}
                        variant={displayCount === mockTemplateData.length ? 'contained' : 'outlined'}
                    >
                        Tất cả
                    </Button>
                </ButtonGroup>
            </Box>

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

            <Box sx={{
                height: displayCount <= 5 ? '350px' :
                    displayCount <= 10 ? '550px' : '700px',
                transition: 'height 0.3s ease-in-out'
            }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={filteredData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
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
                        <Bar dataKey="bookings" name="Số lượng đặt" fill="#2196f3" />
                        <Bar dataKey="participants" name="Số người tham gia" fill="#4caf50" />
                        <Bar dataKey="reviews" name="Số đánh giá" fill="#ff9800" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default BookingAndReviewFromTourTemplate;
