import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, FormControl, Select, MenuItem, CircularProgress, InputLabel, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchSocialMediaHashtagDetail } from '@services/ReportService';
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

const HashtagReport = ({ hashtagId }) => {
    const [loading, setLoading] = useState(true);
    const [hashtagData, setHashtagData] = useState(null);
    const [selectedMetrics, setSelectedMetrics] = useState('interactions');
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

    useEffect(() => {
        const loadHashtagData = async () => {
            if (!startDate || !endDate) return;

            try {
                setLoading(true);
                const data = await fetchSocialMediaHashtagDetail(
                    hashtagId,
                    startDate.format('YYYY-MM-DD'),
                    endDate.format('YYYY-MM-DD')
                );
                setHashtagData(data);
            } catch (error) {
                console.error('Error fetching hashtag details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (hashtagId) {
            loadHashtagData();
        }
    }, [hashtagId, startDate, endDate]);

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

    const timeSeriesData = hashtagData?.socialMediaSummary?.dates?.map((date, index) => ({
        date,
        facebook: hashtagData.socialMediaSummary.facebook[currentMetric.fbKey][index] || 0,
        twitter: hashtagData.socialMediaSummary.twitter[currentMetric.twKey][index] || 0,
    })) || [];

    const summaryStats = [
        { label: 'Tổng bài đăng trên X', value: hashtagData?.totalXPost || 0 },
        { label: 'Tổng bài đăng trên Facebook', value: hashtagData?.totalFacebookPost || 0 },
        { label: 'Điểm đánh giá mức độ quan tâm trung bình', value: (hashtagData?.averageScore || 0).toFixed(2) },
        { label: 'Điểm đánh giá mức độ quan tâm trung bình trên Facebook', value: (hashtagData?.averageFacebookScore || 0).toFixed(2) },
        { label: 'Điểm đánh giá mức độ quan tâm trung bình trên X', value: (hashtagData?.averageXScore || 0).toFixed(2) },
        { label: 'Tỷ lệ nhấp chuột trên Facebook (%)', value: ((hashtagData?.facebookCTR || 0) * 100).toFixed(2) },
        { label: 'Tỷ lệ nhấp chuột trên X (%)', value: ((hashtagData?.xctr || 0) * 100).toFixed(2) },
    ];

    const ctrData = [{
        name: hashtagData?.hashtagName || '',
        'Facebook CTR': ((hashtagData?.facebookCTR || 0) * 100),
        'X CTR': ((hashtagData?.xctr || 0) * 100),
    }];

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

                {/* Hashtag Name - Always show */}
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        #{hashtagData?.hashtagName || 'Không có dữ liệu'}
                    </Typography>
                </Grid>

                {/* Summary Statistics - Always show */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Thống kê tổng quan
                        </Typography>
                        <Grid container spacing={2}>
                            {summaryStats.map((stat, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
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

                {/* CTR Chart - Always show */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" textAlign="center" gutterBottom fontWeight="bold">
                            Biểu đồ tỷ lệ nhấp chuột (CTR)
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            {hashtagData ? (
                                <BarChart data={ctrData} margin={{ top: 35, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tickFormatter={(value) => `#${value}`} />
                                    <YAxis
                                        label={{
                                            value: "Tỷ lệ nhấp chuột (%)",
                                            position: "top",
                                            offset: 20,
                                            style: { fontSize: 16 },
                                            dx: 50,
                                        }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="Facebook CTR" fill="#1877F2" />
                                    <Bar dataKey="X CTR" fill="#000000" />
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

export default HashtagReport;