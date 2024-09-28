import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const AttractionCard = ({ attraction, isOpen }) => {
    return (
        <Card sx={{ display: 'flex', height: isOpen ? '15rem' : '13.3rem', p: '0.5rem', borderRadius: 1.5 }}>
            <CardMedia
                component="img"
                sx={{ width: '33%', height: isOpen ? '14rem' : '12.3rem', borderRadius: 1.5 }}
                image={attraction.AttractionImages[0].url}
                alt={attraction.AttractionImages[0].alt}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', ml: '1rem' }}>
                    <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ fontSize: isOpen ? '1.2rem' : '1rem', width: '50%' }}>
                        {attraction.AttractionType}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ width: '45%', textAlign: 'right' }}>
                        Tạo ngày: {new Date(attraction.CreatedDate).toLocaleDateString()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', width: '100%', p: '0.5rem' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                            <Typography noWrap component="div" variant="h6" sx={{ fontSize: isOpen ? '1.8rem' : '1.42rem', mt: 0.5 }}>
                                {attraction.Name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 1, display: 'flex', alignItems: 'center', fontSize: isOpen ? '1.05rem' : '1rem', height: isOpen ? '2.9rem' : '2.6rem' }}>
                                <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    Địa chỉ: {attraction.Address}
                                </Box>
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="div" sx={{ color: '#05073C', display: 'flex', fontSize: isOpen ? '1.1rem' : '1rem', height: isOpen ? '4.5rem' : '4.1rem' }}>
                                <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                    {attraction.Description}
                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', pb: 1, flexDirection: 'column', width: '25%' }}>
                        <Typography variant="h6" color="text.secondary" component="div" sx={{ mt: isOpen ? 0.8 : 0 }}>
                            ID:  {attraction.AttractionId}
                        </Typography>
                        <Button variant="outlined"
                            sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', width: isOpen ? '7rem' : '5.3rem', borderRadius: 1.5, mb: 1, mt: isOpen ? 1.2 : 0.5, color: 'red', borderColor: 'red' }}>
                            Xóa
                        </Button>
                        <Button variant="outlined" component={Link}  to={"/quan-ly/diem-tham-quan/sua/" + attraction.AttractionId} 
                            sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', width: isOpen ? '7rem' : '5.3rem', mb: 1, borderRadius: 1.5 }}>
                            Sửa
                        </Button>
                        <Button variant="outlined" component={Link}  to={"/quan-ly/diem-tham-quan/chi-tiet/" + attraction.AttractionId} 
                            sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', width: isOpen ? '7rem' : '5.3rem', borderRadius: 1.5, color: 'gray', borderColor: 'gray' }}>
                            Chi tiết
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default AttractionCard;
