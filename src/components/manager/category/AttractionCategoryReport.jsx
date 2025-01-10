import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, FormControl, Select, MenuItem, CircularProgress, InputLabel, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchSocialMediaAttractionCategoryDetail } from '@services/ReportService';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DateRangeSelector from '@components/common/DateRangeSelector';

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

const AttractionCategoryReport = ({ categoryId }) => {
    const [loading, setLoading] = useState(true);
    const [categoryData, setCategoryData] = useState(null);
    const [selectedMetrics, setSelectedMetrics] = useState('interactions');
    const [selectedProvinceMetric, setSelectedProvinceMetric] = useState('averageScore');
    
    const [dateRange, setDateRange] = useState({
        startDate: dayjs().subtract(1, 'month'),
        endDate: dayjs()
    });

    const [appliedDateRange, setAppliedDateRange] = useState({
        startDate: dayjs().subtract(1, 'month'),
        endDate: dayjs()
    });

    const metricsOptions = [
        { value: 'interactions', label: 'Chia sẻ', fbKey: 'shares', twKey: 'retweets' },
        { value: 'comments', label: 'Bình luận', fbKey: 'comments', twKey: 'replies' },
        { value: 'impressions', label: 'Lượt xem', fbKey: 'impressions', twKey: 'impressions' },
        { value: 'reactions', label: 'Phản ứng (biểu tượng cảm xúc)', fbKey: 'reactions', twKey: 'likes' },
        { value: 'scores', label: 'Điểm đánh giá mức độ quan tâm', fbKey: 'score', twKey: 'score' },
    ];

    const provinceMetricsOptions = [
        { value: 'averageScore', label: 'Trung bình' },
        { value: 'averageFacebookScore', label: 'Trung bình trên Facebook' },
        { value: 'averageXScore', label: 'Trung bình trên X' },
        { value: 'averageTourTemplateScore', label: 'Trung bình trên Vietway' },
    ];

    useEffect(() => {
        const loadCategoryData = async () => {
            if (!appliedDateRange.startDate || !appliedDateRange.endDate) return;
            
            try {
                setLoading(true);
                const data = await fetchSocialMediaAttractionCategoryDetail(
                    categoryId, 
                    appliedDateRange.startDate.format('YYYY-MM-DD'), 
                    appliedDateRange.endDate.format('YYYY-MM-DD')
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
    }, [categoryId, appliedDateRange]);

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

    const handleApplyDateRange = () => {
        setAppliedDateRange(dateRange);
    };

    const currentMetric = metricsOptions.find(option => option.value === selectedMetrics);
    const selectedMetricLabel = currentMetric?.label || 'Chọn chỉ số so sánh';

    const timeSeriesData = categoryData?.socialMediaSummary?.dates?.map((date, index) => ({
        date,
        facebook: categoryData.socialMediaSummary.facebook[currentMetric.fbKey][index] || 0,
        twitter: categoryData.socialMediaSummary.twitter[currentMetric.twKey][index] || 0,
    })) || [];

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

    const summaryStats = [
        { label: 'Tổng số điểm tham quan', value: categoryData?.totalAttraction || 0 },
        { label: 'Tổng bài đăng trên X', value: categoryData?.totalXPost || 0 },
        { label: 'Tổng bài đăng trên Facebook', value: categoryData?.totalFacebookPost || 0 },
        { label: 'Điểm đánh giá mức độ quan tâm trung bình', value: (categoryData?.averageScore || 0).toFixed(2) },
        { label: 'Điểm đánh giá mức độ quan tâm trung bình trên Facebook', value: (categoryData?.averageFacebookScore || 0).toFixed(2) },
        { label: 'Điểm đánh giá mức độ quan tâm trung bình trên X', value: (categoryData?.averageXScore || 0).toFixed(2) },
        { label: 'Điểm đánh giá mức độ quan tâm trung bình trên trang Vietway', value: (categoryData?.averageAttractionScore || 0).toFixed(2) },
    ];

    const label = provinceMetricsOptions.find(option => option.value === selectedProvinceMetric)?.label;
    const formattedLabel = label ? label.charAt(0).toLowerCase() + label.slice(1) : '';

    return (
        <Box sx={{ p: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <DateRangeSelector
                                startDate={dateRange.startDate}
                                endDate={dateRange.endDate}
                                onStartDateChange={handleStartDateChange}
                                onEndDateChange={handleEndDateChange}
                                onApply={handleApplyDateRange}
                            />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {categoryData.categoryName}
                    </Typography>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Thống kê tổng quan
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

                {timeSeriesData.length > 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <FormControl sx={{ minWidth: 250, maxWidth: 300 }}>
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
                            <Typography variant="h6" textAlign="center" fontWeight={'bold'}>
                                Biểu đồ so sánh {selectedMetrics === 'scores' ? "" : "số lượng"} {selectedMetricLabel.toLowerCase()} giữa Facebook và X(Twitter) theo thời gian
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={timeSeriesData} margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 13 }} />
                                    <YAxis
                                        tick={{ fontSize: 13 }}
                                        label={{
                                            value: `${selectedMetrics === 'scores' ? 'Điểm đánh giá mức độ quan tâm' : 'Lượt'}`,
                                            position: "top",
                                            offset: 20,
                                            style: { fontSize: 16 },
                                            dx: selectedMetrics === 'scores' ? 80 : 30,
                                        }}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="facebook" name="Facebook" stroke="#1877F2" strokeWidth={2} />
                                    <Line type="monotone" dataKey="twitter" name="X (Twitter)" stroke="#000000" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                )}

                {categoryData.provinces?.length > 0 && (
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
                                Biểu đồ so sánh điểm đánh giá mức độ quan tâm {formattedLabel} giữa các tỉnh thành từ {dateRange.startDate.format('MM/YYYY')} đến {dateRange.endDate.format('MM/YYYY')}
                            </Typography>
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
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default AttractionCategoryReport;