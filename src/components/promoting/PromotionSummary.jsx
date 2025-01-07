import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, FormControl, Select, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Visibility, Share, Comment, ThumbUp, Repeat, Favorite, Reply, TrendingUp, Facebook, } from '@mui/icons-material';
import XIcon from '@mui/icons-material/X';

const PromotionSummary = ({ socialMediaData, promotionData }) => {
    const [selectedMetrics, setSelectedMetrics] = useState('interactions');

    const metricsOptions = [
        { value: 'interactions', label: 'Chia sẻ', fbKey: 'fbShares', twKey: 'twRetweets' },
        { value: 'comments', label: 'Bình luận', fbKey: 'fbComments', twKey: 'twReplies' },
        { value: 'impressions', label: 'Lượt xem', fbKey: 'fbImpressions', twKey: 'twImpressions' },
        { value: 'reactions', label: 'Phản ứng (biểu tượng cảm xúc)', fbKey: 'fbReactions', twKey: 'twLikes' },
        { value: 'scores', label: 'Điểm đánh giá mức độ quan tâm', fbKey: 'fbScore', twKey: 'twScore' },
    ];

    const currentMetric = metricsOptions.find(option => option.value === selectedMetrics);

    const timeSeriesData = socialMediaData?.dates?.map((date, index) => ({
        date: date,
        [currentMetric.fbKey]: socialMediaData.facebook[currentMetric.fbKey.replace('fb', '').toLowerCase()][index],
        [currentMetric.twKey]: socialMediaData.twitter[currentMetric.twKey.replace('tw', '').toLowerCase()][index],
    })) || [];

    const selectedMetricLabel = metricsOptions.find(option => option.value === selectedMetrics)?.label || 'Chọn chỉ số so sánh';

    return (
        <Box sx={{ p: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="subtitle1">Chọn chỉ số so sánh:</Typography>
                        <FormControl size="small" sx={{ minWidth: 300 }}>
                            <Select
                                value={selectedMetrics}
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
                    <Typography variant="h6" textAlign="center" fontWeight={'bold'}>Biểu đồ so sánh {selectedMetrics == 'scores' ? "" : "số lượng"} {selectedMetricLabel.toLocaleLowerCase()} giữa Facebook và X(Twitter) theo thời gian</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={timeSeriesData} margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 13 }} />
                            <YAxis tick={{ fontSize: 13 }}
                                label={{
                                    value: `${selectedMetrics == 'scores' ? 'Điểm đánh giá mức độ quan tâm' : 'Lượt'}`,
                                    position: "top",
                                    offset: 20,
                                    style: { fontSize: 16 },
                                    dx: selectedMetrics == 'scores' ? 80 : 30,
                                }} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey={currentMetric.fbKey}
                                name="Facebook"
                                stroke="#1877F2"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey={currentMetric.twKey}
                                name="X (Twitter)"
                                stroke="#000000"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Grid>

                {/* Thống kê tổng hợp */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{
                        color: '#1877F2',  // Facebook blue
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        borderBottom: '1px solid #eee',
                        pb: 1, ml: 7
                    }}>
                        <Facebook />
                        Tổng kết Facebook
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2, ml: 7 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Visibility sx={{ color: '#666' }} />
                            <Typography>Tổng lượt xem: <strong>{promotionData?.facebook?.impressions?.toLocaleString() || 0}</strong></Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TrendingUp sx={{ color: '#666' }} />
                            <Typography>Tổng lượt giới thiệu: <strong>{promotionData?.facebook?.referrals?.toLocaleString() || 0}</strong></Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Comment sx={{ color: '#666' }} />
                            <Typography>Tổng bình luận: <strong>{promotionData?.facebook?.comments?.toLocaleString() || 0}</strong></Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Share sx={{ color: '#666' }} />
                            <Typography>Tổng chia sẻ: <strong>{promotionData?.facebook?.shares?.toLocaleString() || 0}</strong></Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <ThumbUp sx={{ color: '#666' }} />
                            <Typography>Tổng phản ứng: <strong>{promotionData?.facebook?.reactions?.toLocaleString() || 0}</strong></Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{
                        color: '#000',  // X (Twitter) black
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        borderBottom: '1px solid #eee',
                        pb: 1, ml: 7
                    }}>
                        <XIcon />
                        Tổng kết X (Twitter)
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2, ml: 7 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Visibility sx={{ color: '#666' }} />
                            <Typography>Tổng lượt xem: <strong>{promotionData?.twitter?.impressions?.toLocaleString() || 0}</strong></Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TrendingUp sx={{ color: '#666' }} />
                            <Typography>Tổng lượt giới thiệu: <strong>{promotionData?.twitter?.referrals?.toLocaleString() || 0}</strong></Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Repeat sx={{ color: '#666' }} />
                            <Typography>Tổng retweet: <strong>{promotionData?.twitter?.retweets?.toLocaleString() || 0}</strong></Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Reply sx={{ color: '#666' }} />
                            <Typography>Tổng trả lời: <strong>{promotionData?.twitter?.replies?.toLocaleString() || 0}</strong></Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Favorite sx={{ color: '#666' }} />
                            <Typography>Tổng lượt thích: <strong>{promotionData?.twitter?.likes?.toLocaleString() || 0}</strong></Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PromotionSummary;
