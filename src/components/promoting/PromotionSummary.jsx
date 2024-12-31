import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
    Visibility, 
    Share, 
    Comment, 
    ThumbUp, 
    Repeat, 
    Favorite, 
    Reply, 
    TrendingUp,
    Facebook,
} from '@mui/icons-material';
import XIcon from '@mui/icons-material/X'; // X (Twitter) icon

// Component tổng hợp thông tin quảng cáo
const PromotionSummary = ({ socialMediaData, promotionData }) => {
    // Định dạng dữ liệu chuỗi thời gian mạng xã hội
    const timeSeriesData = socialMediaData?.dates?.map((date, index) => ({
        date: date,
        fbComments: socialMediaData.facebook.comments[index],
        fbShares: socialMediaData.facebook.shares[index], 
        fbReactions: socialMediaData.facebook.reactions[index],
        fbImpressions: socialMediaData.facebook.impressions[index],
        fbScore: socialMediaData.facebook.score[index],
        twRetweets: socialMediaData.twitter.retweets[index],
        twReplies: socialMediaData.twitter.replies[index],
        twLikes: socialMediaData.twitter.likes[index],
        twImpressions: socialMediaData.twitter.impressions[index],
        twScore: socialMediaData.twitter.score[index],
    })) || [];

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Biểu đồ chỉ số Facebook */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Tương tác Facebook
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="fbComments" name="Bình luận" stroke="#1a32c7" strokeWidth={2} />
                                <Line type="monotone" dataKey="fbShares" name="Chia sẻ" stroke="#0a9d15" strokeWidth={2} />
                                <Line type="monotone" dataKey="fbReactions" name="Phản ứng (biểu tượng cảm xúc)" stroke="#a100d5" strokeWidth={2} />
                                <Line type="monotone" dataKey="fbImpressions" name="Lượt xem" stroke="#d55a00" strokeWidth={2} />
                                <Line type="monotone" dataKey="fbScore" name="Mức độ quan tâm" stroke="#ff0000" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Biểu đồ chỉ số Twitter */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Tương tác X (Twitter)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="twReplies" name="Trả lời" stroke="#1a32c7" strokeWidth={2} />
                                <Line type="monotone" dataKey="twRetweets" name="Chia sẻ" stroke="#0a9d15" strokeWidth={2} />
                                <Line type="monotone" dataKey="twLikes" name="Lượt thích" stroke="#a100d5" strokeWidth={2} />
                                <Line type="monotone" dataKey="twImpressions" name="Lượt xem" stroke="#d55a00" strokeWidth={2} />
                                <Line type="monotone" dataKey="twScore" name="Mức độ quan tâm" stroke="#ff0000" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Thống kê tổng hợp */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                            color: '#1877F2',  // Facebook blue
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            borderBottom: '1px solid #eee',
                            pb: 1
                        }}>
                            <Facebook />
                            Tổng kết Facebook
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
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
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                            color: '#000',  // X (Twitter) black
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            borderBottom: '1px solid #eee',
                            pb: 1
                        }}>
                            <XIcon />
                            Tổng kết X (Twitter)
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
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
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PromotionSummary;
