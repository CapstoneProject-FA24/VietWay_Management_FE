import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, IconButton } from '@mui/material';

const TourTemplateCard = ({ tour, isOpen }) => {
    return (
        <Card sx={{ display: 'flex', height: isOpen ? '15.9rem' : '13.9rem', p: '0.7rem', borderRadius: 1.5 }}>
            <CardMedia
                component="img"
                sx={{ width: '33%', height: isOpen ? '14.5rem' : '12.5rem', borderRadius: 1.5 }}
                image={tour.TourTemplateImages[0].url}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '67%' }}>
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start', ml: '1rem' }}>
                    <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ fontSize: isOpen ? '1rem' : '0.9rem', width: isOpen ? '85%' : '65%' }}>
                        {tour.TourTemplateProvince} - {tour.TourTemplateCategory}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', alignItems: 'center', ml: '1rem' }}>
                        <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ fontSize: isOpen ? '0.95rem' : '0.85rem', textAlign: 'right' }}>
                            Tạo ngày: {new Date(tour.TourTemplateCreatedDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ fontSize: isOpen ? '0.95rem' : '0.85rem', textAlign: 'right' }}>
                            Ngày sửa: {new Date(tour.TourTemplateUpdatedDate).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', width: '100%', p: '0.5rem', mt: -1.5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                            <Typography noWrap component="div" variant="h6" sx={{ fontSize: isOpen ? '1.68rem' : '1.3rem', mt: 0.5, wordSpacing: -2.5 }}>
                                {tour.TourName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center', fontSize: isOpen ? '1.05rem' : '1rem' }}>
                                <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    Thời lượng: {tour.TourTemplateDuration}
                                </Box>
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', fontSize: isOpen ? '1.05rem' : '1rem' }}>
                                <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    Khởi hành từ: {tour.TourTemplateDeparturePoint}
                                </Box>
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="div" sx={{ color: '#05073C', display: 'flex', fontSize: isOpen ? '1.1rem' : '1rem', height: isOpen ? '4.5rem' : '4.1rem' }}>
                                <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                    {tour.Description}
                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', pb: 1, flexDirection: 'column', width: '25%' }}>
                        <Typography variant="h6" color="text.secondary" component="div" sx={{ mt: isOpen ? 0.8 : 0.3, fontSize: isOpen ? '1.5rem' : '1.2rem' }}>
                            ID: {tour.TourTemplateId}
                        </Typography>
                        <Button variant="outlined"
                            sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', width: isOpen ? '7rem' : '5.3rem', borderRadius: 1.5, mb: 1, mt: isOpen ? 1.2 : 0.5, color: 'red', borderColor: 'red' }}>
                            Xóa
                        </Button>
                        <Button variant="outlined"
                            sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', width: isOpen ? '7rem' : '5.3rem', mb: 1, borderRadius: 1.5 }}>
                            Sửa
                        </Button>
                        <Button variant="outlined"
                            sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', width: isOpen ? '7rem' : '5.3rem', borderRadius: 1.5, color: 'gray', borderColor: 'gray' }}>
                            Chi tiết
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default TourTemplateCard;
