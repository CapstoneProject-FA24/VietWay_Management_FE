import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, FormControl, Select, MenuItem, CircularProgress, InputLabel, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchSocialMediaAttractionCategoryDetail } from '@services/ReportService';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
        const data = payload[0].payload;
        return (
            <Box sx={{
                backgroundColor: 'white',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px'
            }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {label}
                </Typography>
                <Typography variant="body2">
                    {`${payload[0].name}: ${payload[0].value.toFixed(2)}`}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Số địa điểm: {data.totalAttraction || 0}
                </Typography>
                <Typography variant="body2">
                    Số bài viết trên Facebook: {data.totalFacebookPost || 0}
                </Typography>
                <Typography variant="body2">
                    Số bài viết trên X (Twitter): {data.totalXPost || 0}
                </Typography>
            </Box>
        );
    }
    return null;
};

const AttractionCategoryReport = ({ categoryId, initialStartDate, initialEndDate }) => {
    const [loading, setLoading] = useState(true);
    const [categoryData, setCategoryData] = useState(null);
    const [selectedMetrics, setSelectedMetrics] = useState('average');
    
    const [startDate, setStartDate] = useState(() => {
        return initialStartDate ? dayjs(initialStartDate) : dayjs().subtract(1, 'month');
    });
    const [endDate, setEndDate] = useState(() => {
        return initialEndDate ? dayjs(initialEndDate) : dayjs();
    });
    const [tempStartDate, setTempStartDate] = useState(() => {
        return initialStartDate ? dayjs(initialStartDate) : dayjs().subtract(1, 'month');
    });
    const [tempEndDate, setTempEndDate] = useState(() => {
        return initialEndDate ? dayjs(initialEndDate) : dayjs();
    });

    useEffect(() => {
        const loadCategoryData = async () => {
            if (!startDate || !endDate) return;
            
            try {
                setLoading(true);
                const data = await fetchSocialMediaAttractionCategoryDetail(
                    categoryId, 
                    startDate.format('YYYY-MM-DD'), 
                    endDate.format('YYYY-MM-DD')
                );
                setCategoryData(data);
            } catch (error) {
                console.error('Error fetching category details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            loadCategoryData();
        }
    }, [categoryId, startDate, endDate]);

    const handleApplyDateRange = () => {
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
    };

    const chartOptions = [
        { value: 'average', label: 'Trung bình', key: 'averageScore' },
        { value: 'facebook', label: 'Facebook', key: 'averageFacebookScore' },
        { value: 'twitter', label: 'X (Twitter)', key: 'averageXScore' },
        { value: 'attraction', label: 'Địa điểm', key: 'averageAttractionScore' }
    ];

    const currentMetric = chartOptions.find(option => option.value === selectedMetrics);

    const summaryStats = [
        { label: 'Tổng địa điểm', value: categoryData?.totalAttraction || 0 },
        { label: 'Tổng bài viết X', value: categoryData?.totalXPost || 0 },
        { label: 'Tổng bài viết Facebook', value: categoryData?.totalFacebookPost || 0 },
        { label: 'Điểm trung bình', value: (categoryData?.averageScore || 0).toFixed(2) },
        { label: 'Điểm Facebook trung bình', value: (categoryData?.averageFacebookScore || 0).toFixed(2) },
        { label: 'Điểm X trung bình', value: (categoryData?.averageXScore || 0).toFixed(2) },
        { label: 'Điểm địa điểm trung bình', value: (categoryData?.averageAttractionScore || 0).toFixed(2) },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!categoryData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Typography>Không có dữ liệu</Typography>
            </Box>
        );
    }

    const timeSeriesData = categoryData?.socialMediaSummary?.dates?.map((date, index) => ({
        date,
        facebook: categoryData.socialMediaSummary.facebook.score[index] || 0,
        twitter: categoryData.socialMediaSummary.twitter.score[index] || 0,
    })) || [];

    return (
        <Box sx={{ p: 1 }}>
            <Grid container spacing={2}>
                {/* Date Range Selection */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <Typography variant="subtitle1">
                                Chọn khoảng thời gian:
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Từ ngày"
                                    value={tempStartDate}
                                    onChange={(newValue) => setTempStartDate(newValue)}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            sx: { width: 200 }
                                        }
                                    }}
                                />
                                <DatePicker
                                    label="Đến ngày"
                                    value={tempEndDate}
                                    onChange={(newValue) => setTempEndDate(newValue)}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            sx: { width: 200 }
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                            <Button 
                                variant="contained" 
                                onClick={handleApplyDateRange}
                                disabled={!tempStartDate || !tempEndDate || tempEndDate.isBefore(tempStartDate)}
                            >
                                Áp dụng
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Summary Statistics */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Thống kê tổng quan - {categoryData.categoryName}
                        </Typography>
                        <Grid container spacing={2}>
                            {summaryStats.map((stat, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {stat.label}:
                                    </Typography>
                                    <Typography variant="h6">
                                        {stat.value}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>

                {/* Time Series Chart */}
                {timeSeriesData.length > 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Biểu đồ theo thời gian
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 13 }}/>
                                    <YAxis tick={{ fontSize: 13 }}/>
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="facebook" name="Facebook" stroke="#1877F2" strokeWidth={2} />
                                    <Line type="monotone" dataKey="twitter" name="X (Twitter)" stroke="#000000" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                )}

                {/* Provinces Chart */}
                {categoryData.provinces?.length > 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                                    Thống kê theo tỉnh thành
                                </Typography>
                                <FormControl sx={{ minWidth: 250, maxWidth: 300 }}>
                                    <InputLabel>Thống kê điểm mức độ quan tâm</InputLabel>
                                    <Select
                                        sx={{ fontSize: '0.9rem' }}
                                        value={selectedMetrics}
                                        label="Thống kê điểm mức độ quan tâm"
                                        onChange={(e) => setSelectedMetrics(e.target.value)}
                                    >
                                        {chartOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart 
                                    data={categoryData.provinces} 
                                    margin={{
                                        top: 50,
                                        right: 10,
                                        left: -10,
                                        bottom: 10,
                                    }}
                                    barCategoryGap={20}
                                    barGap={0}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="provinceName"
                                        textAnchor={categoryData.provinces.length > 10 ? 'end' : 'middle'}
                                        height={categoryData.provinces.length > 10 ? 160 : 50}
                                        interval={0}
                                        angle={categoryData.provinces.length > 10 ? -60 : 0}
                                        tick={{
                                            fontSize: 13,
                                            width: categoryData.provinces.length > 10 ? 160 : 130,
                                            wordWrap: 'break-word'
                                        }}
                                    />
                                    <YAxis 
                                        label={{
                                            value: "Điểm đánh giá mức độ quan tâm",
                                            position: "top",
                                            offset: 20,
                                            style: { fontSize: 16 },
                                            dx: 100,
                                        }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar 
                                        dataKey={currentMetric.key}
                                        name={currentMetric.label}
                                        fill={
                                            selectedMetrics === 'average' ? '#0a9d15' :
                                            selectedMetrics === 'facebook' ? '#1877F2' :
                                            selectedMetrics === 'twitter' ? '#000000' :
                                            '#ff7300'
                                        }
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default AttractionCategoryReport;