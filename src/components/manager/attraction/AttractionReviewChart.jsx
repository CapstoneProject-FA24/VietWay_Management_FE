import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Box, Paper, Typography, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const AttractionReviewChart = ({ data }) => {
    const [displayCount, setDisplayCount] = useState(5);

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
        '3 sao': '#ffff4d',
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
            // First sort by average rating
            const ratingDiff = b.average - a.average;

            // If ratings are equal (or very close), sort by total number of ratings
            if (Math.abs(ratingDiff) < 0.1) {
                return b.totalRatings - a.totalRatings;
            }
            return ratingDiff;
        });

    const displayData = sortedData.slice(0, displayCount);

    const handleDisplayChange = (newCount) => {
        setDisplayCount(newCount);
    };

    const renderButtons = () => {
        if (displayCount === 5) {
            return (
                <Button
                    variant="outlined"
                    onClick={() => handleDisplayChange(10)}
                    endIcon={<KeyboardArrowDownIcon />}
                >
                    Xem top 10
                </Button>
            );
        }

        if (displayCount === 10) {
            return (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => handleDisplayChange(5)}
                        endIcon={<KeyboardArrowUpIcon />}
                    >
                        Thu gọn
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleDisplayChange(sortedData.length)}
                        endIcon={<KeyboardArrowDownIcon />}
                    >
                        Xem tất cả
                    </Button>
                </Box>
            );
        }

        return (
            <Button
                variant="outlined"
                onClick={() => handleDisplayChange(5)}
                endIcon={<KeyboardArrowUpIcon />}
            >
                Thu gọn
            </Button>
        );
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
                    <Typography variant="h6" gutterBottom>
                        Đánh giá của các điểm tham quan theo tỉnh thành
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sắp xếp theo đánh giá trung bình và số lượng đánh giá
                    </Typography>
                </Box>
                {renderButtons()}
            </Box>
            <Box sx={{
                height: displayCount <= 5 ? '300px' :
                    displayCount <= 10 ? '500px' : '100%',
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

export default AttractionReviewChart;
