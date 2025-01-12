import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Box, Paper, Typography } from '@mui/material';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2">{label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Đánh giá trung bình: {payload[0]?.payload.averageRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Tổng số đánh giá: {payload[0]?.payload.totalRating}
                </Typography>
            </Paper>
        );
    }
    return null;
};

const AttractionReviewChart = ({ ratingData }) => {
   console.log(ratingData);
    const filteredData = ratingData
        .filter(item => item.totalRating >= 0)
        .sort((a, b) => {
            // Primary sort by average rating (descending)
            if (b.averageRating !== a.averageRating) {
                return b.averageRating - a.averageRating;
            }
            // Secondary sort by total ratings if average ratings are equal
            return b.totalRating - a.totalRating;
        });

    // Custom colors for the bars
    const barColor = '#2196f3'; // You can adjust this color

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#0051cd' }}>
                        Thống kê đánh giá trung bình của các điểm tham quan
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sắp xếp theo đánh giá trung bình và số lượng đánh giá
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ height: filteredData.length > 0 ? (filteredData.length > 10 ? (filteredData.length > 20 ? '800px' : '550px') : '300px') : '100px' }}>
                {filteredData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={filteredData}
                            layout="vertical"
                            margin={{ top: 5, right: 60, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                domain={[0, 5]}
                                tickCount={6}
                                label={{
                                    value: "Sao",
                                    position: "right",
                                    offset: 20,
                                    style: { fontSize: 15 },
                                    dx: -5,
                                    dy: -15
                                }}
                            />
                            <YAxis
                                dataKey="attractionName"
                                type="category"
                                width={300}
                                tick={props => {
                                    const { x, y, payload } = props;
                                    const text = payload.value;
                                    const maxLength = 60;
                                    const displayText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

                                    return (
                                        <g transform={`translate(${x},${y})`}>
                                            <text
                                                x={0}
                                                y={0}
                                                dy={4}
                                                textAnchor="end"
                                                fill="#666666"
                                                fontSize={12.5}
                                            >
                                                {displayText}
                                            </text>
                                        </g>
                                    );
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {/* <Legend /> */}
                            <Bar
                                dataKey="averageRating"
                                fill={barColor}
                                name="Đánh giá trung bình"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography color="text.secondary">
                            Không có dữ liệu đánh giá trong khoảng thời gian này
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default AttractionReviewChart;
