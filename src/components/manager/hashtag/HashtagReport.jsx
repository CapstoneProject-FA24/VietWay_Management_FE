import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, FormControl, Select, MenuItem, CircularProgress, InputLabel, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Temporary mock data function - replace with actual API call later
const fetchHashtagReport = async (hashtagId, startDate, endDate) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate dates between start and end
    const dates = [];
    let currentDate = dayjs(startDate);
    while (currentDate.isBefore(dayjs(endDate)) || currentDate.isSame(dayjs(endDate))) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        currentDate = currentDate.add(1, 'day');
    }

    // Generate random data for each metric
    const generateRandomData = () => dates.map(() => Math.floor(Math.random() * 100));

    return {
        hashtagId: hashtagId,
        hashtagName: `#trending${hashtagId}`,
        totalXPost: Math.floor(Math.random() * 1000),
        totalFacebookPost: Math.floor(Math.random() * 1000),
        averageScore: (Math.random() * 5).toFixed(2),
        averageFacebookScore: (Math.random() * 5).toFixed(2),
        averageXScore: (Math.random() * 5).toFixed(2),
        reportSocialMediaSummary: {
            dates: dates,
            facebookComments: generateRandomData(),
            facebookShares: generateRandomData(),
            facebookReactions: generateRandomData(),
            facebookImpressions: generateRandomData(),
            facebookScore: generateRandomData(),
            xRetweets: generateRandomData(),
            xReplies: generateRandomData(),
            xLikes: generateRandomData(),
            xImpressions: generateRandomData(),
            xScore: generateRandomData()
        }
    };
};

const HashtagReport = ({ hashtagId }) => {
    const [loading, setLoading] = useState(true);
    const [hashtagData, setHashtagData] = useState(null);
    const [selectedMetrics, setSelectedMetrics] = useState('interactions');
    const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month'));
    const [endDate, setEndDate] = useState(dayjs());
    const [tempStartDate, setTempStartDate] = useState(dayjs().subtract(1, 'month'));
    const [tempEndDate, setTempEndDate] = useState(dayjs());

    const metricsOptions = [
        { value: 'interactions', label: 'Chia sẻ', fbKey: 'facebookShares', twKey: 'xRetweets' },
        { value: 'comments', label: 'Bình luận', fbKey: 'facebookComments', twKey: 'xReplies' },
        { value: 'impressions', label: 'Lượt xem', fbKey: 'facebookImpressions', twKey: 'xImpressions' },
        { value: 'reactions', label: 'Phản ứng', fbKey: 'facebookReactions', twKey: 'xLikes' },
        { value: 'scores', label: 'Điểm đánh giá mức độ quan tâm', fbKey: 'facebookScore', twKey: 'xScore' },
    ];

    useEffect(() => {
        const loadHashtagData = async () => {
            if (!startDate || !endDate) return;

            try {
                setLoading(true);
                const data = await fetchHashtagReport(
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

    if (!hashtagData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Typography>Không có dữ liệu</Typography>
            </Box>
        );
    }

    const currentMetric = metricsOptions.find(option => option.value === selectedMetrics);
    const selectedMetricLabel = currentMetric?.label || 'Chọn chỉ số so sánh';

    const timeSeriesData = hashtagData.reportSocialMediaSummary.dates.map((date, index) => ({
        date,
        facebook: hashtagData.reportSocialMediaSummary[currentMetric.fbKey][index] || 0,
        twitter: hashtagData.reportSocialMediaSummary[currentMetric.twKey][index] || 0,
    }));

    const summaryStats = [
        { label: 'Tổng bài đăng trên X', value: hashtagData.totalXPost },
        { label: 'Tổng bài đăng trên Facebook', value: hashtagData.totalFacebookPost },
        { label: 'Điểm đánh giá mức độ quan tâm trung bình', value: hashtagData.averageScore },
        { label: 'Điểm đánh giá mức độ quan tâm trung bình trên Facebook', value: hashtagData.averageFacebookScore },
        { label: 'Điểm đánh giá mức độ quan tâm trung bình trên X', value: hashtagData.averageXScore },
    ];

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
                    <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {hashtagData.hashtagName}
                    </Typography>
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

                {/* Time Series Chart */}
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
                            <LineChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="facebook" name="Facebook" stroke="#1877F2" strokeWidth={2} />
                                <Line type="monotone" dataKey="twitter" name="X (Twitter)" stroke="#000000" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HashtagReport;