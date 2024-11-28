import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Box, Paper, Typography, Button, ButtonGroup } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AttractionReviewByProvinceChart = ({ data }) => {
    const [displayCount, setDisplayCount] = useState(5);
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().subtract(6, 'month'),
        endDate: dayjs()
    });

    const [appliedDateRange, setAppliedDateRange] = useState({
        startDate: dayjs().subtract(6, 'month'),
        endDate: dayjs()
    });

    // Example data structure for provinces
    const mockData = [
        { province: 'Đà Nẵng', average: 4.5, '1 sao': 5, '2 sao': 8, '3 sao': 20, '4 sao': 50, '5 sao': 67 },
        { province: 'Quảng Nam', average: 4.4, '1 sao': 6, '2 sao': 10, '3 sao': 22, '4 sao': 48, '5 sao': 64 },
        { province: 'Hà Nội', average: 4.2, '1 sao': 10, '2 sao': 15, '3 sao': 25, '4 sao': 45, '5 sao': 55 },
        { province: 'TP HCM', average: 3.8, '1 sao': 20, '2 sao': 18, '3 sao': 30, '4 sao': 25, '5 sao': 40 },
        { province: 'Huế', average: 4.0, '1 sao': 15, '2 sao': 10, '3 sao': 28, '4 sao': 35, '5 sao': 50 },
        { province: 'Hải Phòng', average: 3.6, '1 sao': 25, '2 sao': 20, '3 sao': 35, '4 sao': 25, '5 sao': 30 },
        { province: 'Cần Thơ', average: 4.3, '1 sao': 7, '2 sao': 10, '3 sao': 22, '4 sao': 40, '5 sao': 60 },
        { province: 'Nha Trang', average: 4.6, '1 sao': 3, '2 sao': 7, '3 sao': 18, '4 sao': 55, '5 sao': 70 },
        { province: 'Quảng Ninh', average: 4.1, '1 sao': 12, '2 sao': 15, '3 sao': 26, '4 sao': 40, '5 sao': 52 },
        { province: 'Lâm Đồng', average: 3.9, '1 sao': 18, '2 sao': 20, '3 sao': 30, '4 sao': 35, '5 sao': 45 },
        { province: 'Bình Thuận', average: 4.7, '1 sao': 2, '2 sao': 5, '3 sao': 15, '4 sao': 60, '5 sao': 75 },
    ];

    const ratingColors = {
        '1 sao': '#ff4d4d',
        '2 sao': '#ffa64d',
        '3 sao': '#FF69B4',
        '4 sao': '#80ff80',
        '5 sao': '#2eb82e',
    };

    // Calculate total ratings and sort data
    const sortedData = [...(data || mockData)]
        .map(province => ({
            ...province,
            totalRatings: province['1 sao'] +
                province['2 sao'] +
                province['3 sao'] +
                province['4 sao'] +
                province['5 sao']
        }))
        .sort((a, b) => {
            const ratingDiff = b.average - a.average;
            if (Math.abs(ratingDiff) < 0.1) {
                return b.totalRatings - a.totalRatings;
            }
            return ratingDiff;
        });

    const displayData = sortedData.slice(0, displayCount);

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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const totalRatings = payload.reduce((sum, entry) => sum + entry.value, 0);
            return (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2">{label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Đánh giá trung bình: {payload[0]?.payload.average.toFixed(1)}
                    </Typography>
                    {payload.map((entry) => (
                        <Typography key={entry.name} variant="body2" sx={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </Typography>
                    ))}
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                        Tổng số đánh giá: {totalRatings}
                    </Typography>
                </Paper>
            );
        }
        return null;
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                        Đánh giá của các điểm tham quan theo tỉnh thành
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sắp xếp theo đánh giá trung bình và số lượng đánh giá
                    </Typography>
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
                        onClick={() => setDisplayCount(sortedData.length)}
                        variant={displayCount === sortedData.length ? 'contained' : 'outlined'}
                    >
                        Tất cả
                    </Button>
                </ButtonGroup>
            </Box>

            {/*<LocalizationProvider dateAdapter={AdapterDayjs}>
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
            </LocalizationProvider>*/}

            <Box sx={{
                height: displayCount <= 5 ? '300px' :
                    displayCount <= 10 ? '400px' : '700px',
                transition: 'height 0.3s ease-in-out'
            }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={displayData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            dataKey="province"
                            type="category"
                            width={90}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {Object.entries(ratingColors).map(([rating, color]) => (
                            <Bar
                                key={rating}
                                dataKey={rating}
                                stackId="stack"
                                fill={color}
                                name={rating}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default AttractionReviewByProvinceChart;
