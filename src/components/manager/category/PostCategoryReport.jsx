import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, FormControl, Select, MenuItem, CircularProgress, InputLabel, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchSocialMediaPostCategoryDetail } from '@services/ReportService';
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
                    Số bài viết: {data.totalSitePost || 0}
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

const PostCategoryReport = ({ categoryId }) => {
    const [loading, setLoading] = useState(true);
    const [categoryData, setCategoryData] = useState(null);
    const [selectedMetrics, setSelectedMetrics] = useState('interactions');
    const [selectedProvinceMetric, setSelectedProvinceMetric] = useState('averageScore');

    const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month'));
    const [endDate, setEndDate] = useState(dayjs().subtract(1, 'day'));
    const [tempStartDate, setTempStartDate] = useState(dayjs().subtract(1, 'month'));
    const [tempEndDate, setTempEndDate] = useState(dayjs().subtract(1, 'day'));

    const metricsOptions = [
        { value: 'interactions', label: 'Chia sẻ', fbKey: 'shares', twKey: 'retweets' },
        { value: 'comments', label: 'Bình luận', fbKey: 'comments', twKey: 'replies' },
        { value: 'impressions', label: 'Lượt xem', fbKey: 'impressions', twKey: 'impressions' },
        { value: 'reactions', label: 'Phản ứng', fbKey: 'reactions', twKey: 'likes' },
        { value: 'scores', label: 'Điểm đánh giá mức độ quan tâm', fbKey: 'score', twKey: 'score' },
    ];

    const provinceMetricsOptions = [
        { value: 'averageScore', label: 'Trung bình' },
        { value: 'averageFacebookScore', label: 'Trung bình trên Facebook' },
        { value: 'averageXScore', label: 'Trung bình trên X' },
        { value: 'averageSitePostScore', label: 'Trung bình trên Vietway' },
    ];

    useEffect(() => {
        const loadCategoryData = async () => {
            if (!startDate || !endDate) return;

            try {
                setLoading(true);
                const data = await fetchSocialMediaPostCategoryDetail(
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    const currentMetric = metricsOptions.find(option => option.value === selectedMetrics);
    const selectedMetricLabel = currentMetric?.label || 'Chọn chỉ số so sánh';

    const timeSeriesData = categoryData?.socialMediaSummary?.dates?.map((date, index) => ({
        date,
        facebook: categoryData.socialMediaSummary.facebook[currentMetric.fbKey][index] || 0,
        twitter: categoryData.socialMediaSummary.twitter[currentMetric.twKey][index] || 0,
    })) || [];

    return (
        <Box sx={{ p: 1 }}>
            <Grid container spacing={2}>
                {/* Date Range Selection - Always show */}
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

                {/* Time Series Chart - Always show */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <FormControl sx={{ minWidth: 250 }}>
                                <InputLabel>Chọn chỉ số so sánh</InputLabel>
                                <Select
                                    value={selectedMetrics}
                                    label="Chọn chỉ số so sánh"
                                    onChange={(e) => setSelectedMetrics(e.target.value)}
                                >
                                    {metricsOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Typography variant="h6" textAlign="center" gutterBottom fontWeight="bold">
                            Biểu đồ so sánh {selectedMetrics === 'scores' ? "" : "số lượng"} {selectedMetricLabel.toLowerCase()} giữa Facebook và X(Twitter) theo thời gian
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            {timeSeriesData.length > 0 ? (
                                <LineChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="facebook" name="Facebook" stroke="#1877F2" strokeWidth={2} />
                                    <Line type="monotone" dataKey="twitter" name="X (Twitter)" stroke="#000000" strokeWidth={2} />
                                </LineChart>
                            ) : (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Typography color="text.secondary">Không có dữ liệu</Typography>
                                </Box>
                            )}
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Provinces Chart - Always show */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <FormControl sx={{ minWidth: 250, maxWidth: 300 }}>
                                <InputLabel>Thống kê điểm mức độ quan tâm</InputLabel>
                                <Select
                                    sx={{ fontSize: '0.9rem' }}
                                    value={selectedProvinceMetric}
                                    label="Thống kê điểm mức độ quan tâm . ."
                                    onChange={(e) => setSelectedProvinceMetric(e.target.value)}
                                >
                                    {provinceMetricsOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Typography variant="h6" textAlign="center" fontWeight={'bold'}>
                            Biểu đồ so sánh điểm đánh giá mức độ quan tâm giữa các tỉnh thành từ {startDate.format('DD/MM/YYYY')} đến {endDate.format('DD/MM/YYYY')}
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            {categoryData?.provinces?.length > 0 ? (
                                <BarChart
                                    data={categoryData.provinces}
                                    margin={{
                                        top: 35,
                                        right: 30,
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
                                        dataKey={selectedProvinceMetric}
                                        name={provinceMetricsOptions.find(option => option.value === selectedProvinceMetric)?.label}
                                        fill={
                                            selectedProvinceMetric === 'averageScore' ? '#0a9d15' :
                                            selectedProvinceMetric === 'averageFacebookScore' ? '#1877F2' :
                                            selectedProvinceMetric === 'averageXScore' ? '#000000' :
                                            '#ff7300'
                                        }
                                    />
                                </BarChart>
                            ) : (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Typography color="text.secondary">Không có dữ liệu</Typography>
                                </Box>
                            )}
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PostCategoryReport;