import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, FormControl, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
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

                {/* Replace the two Grid items with a single table */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, mt: 2 }}>
                        <Typography variant="h6" gutterBottom textAlign="center">
                            Bảng tổng kết số liệu
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Chỉ số</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <Facebook sx={{ color: '#1877F2' }} />
                                            Facebook
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <XIcon />
                                            X (Twitter)
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Visibility sx={{ color: '#666' }} />
                                            Lượt xem
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">{promotionData?.facebook?.impressions?.toLocaleString() || 0}</TableCell>
                                    <TableCell align="center">{promotionData?.twitter?.impressions?.toLocaleString() || 0}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Comment sx={{ color: '#666' }} />
                                            Bình luận
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">{promotionData?.facebook?.comments?.toLocaleString() || 0}</TableCell>
                                    <TableCell align="center">{promotionData?.twitter?.retweets?.toLocaleString() || 0}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Share sx={{ color: '#666' }} />
                                            Chia sẻ
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">{promotionData?.facebook?.shares?.toLocaleString() || 0}</TableCell>
                                    <TableCell align="center">{promotionData?.twitter?.replies?.toLocaleString() || 0}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ThumbUp sx={{ color: '#666' }} />
                                            Phản ứng/Lượt thích
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">{promotionData?.facebook?.reactions?.toLocaleString() || 0}</TableCell>
                                    <TableCell align="center">{promotionData?.twitter?.likes?.toLocaleString() || 0}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PromotionSummary;
