import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Paper, Typography } from '@mui/material';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Paper sx={{ p: 2, backgroundColor: 'white' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    <strong>{label}</strong>
                </Typography>
                <Typography variant="body2" color="primary">
                    Doanh thu: {payload[0].value.toLocaleString('vi-VN')}đ
                </Typography>
            </Paper>
        );
    }
    return null;
};

const TourTemplateRevenue = ({ revenueData }) => {
    // Filter out tours with zero revenue and sort by revenue
    const filteredData = revenueData
        .filter(item => item.totalRevenue > 0)
        .sort((a, b) => b.totalRevenue - a.totalRevenue);

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                        Thống kê doanh thu theo tour
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sắp xếp theo tổng doanh thu
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ height: '400px' }}>
                {filteredData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={filteredData}
                            layout="vertical"
                            margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)} triệu`}
                                label={{
                                    value: "VNĐ",
                                    position: "right",
                                    offset: 20,
                                    style: { fontSize: 15 },
                                    dx: 15,
                                    dy: -17
                                }}
                            />
                            <YAxis
                                dataKey="tourTemplateName"
                                type="category"
                                width={350}
                                tick={props => {
                                    const { x, y, payload } = props;
                                    const text = payload.value;
                                    const maxLength = 50;
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
                            <Legend />
                            <Bar
                                dataKey="totalRevenue"
                                name="Doanh thu"
                                fill="#2196f3"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography color="text.secondary">
                            Không có dữ liệu doanh thu trong khoảng thời gian này
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default TourTemplateRevenue;
