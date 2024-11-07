import React, { useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const TourTemplateCard = ({ tour, isOpen, onOpenDeletePopup }) => {
    const isDraft = tour.status === 0;
    const isEditable = tour.status !== 2 && tour.status !== 1;
    const isApproved = tour.status === 2;

    const location = useLocation();
    const currentPage = location.pathname;

    const handleDelete = () => {
        onOpenDeletePopup(tour);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 0: return 'gray';
            case 1: return 'blue';
            case 2: return 'green';
            case 3: return 'red';
            default: return 'black';
        }
    };

    return (
        <Card sx={{ display: 'flex', height: isOpen ? '15.9rem' : '13.9rem', p: '0.7rem', borderRadius: 1.5 }}>
            <CardMedia
                component="img"
                sx={{ minWidth: '33%', width: '33%', height: isOpen ? '14.5rem' : '12.5rem', borderRadius: 1.5 }}
                image={tour.imageUrl}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '67%', width: '67%' }}>
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', pl: '1rem', mb: 1.5 }}>
                    <Typography variant="h1" color="primary" component="div" sx={{ fontSize: isOpen ? '1.5rem' : '1.2rem' }}>
                        Mã: {tour.code}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography color="text.secondary" component="div" sx={{ fontSize: isOpen ? '0.95rem' : '0.85rem', textAlign: 'right' }}>
                            Tạo ngày: {new Date(tour.createdDate).toLocaleDateString()}
                        </Typography>
                        <Typography color="text.secondary" component="div" sx={{ fontSize: isOpen ? '0.95rem' : '0.85rem', textAlign: 'right' }}>
                            Tạo bởi: {tour.creatorName}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: '0.5rem', mt: isOpen ? -1 : -2, ml: '0.5rem' }}>
                    <Typography noWrap color="text.secondary" component="div" sx={{ fontSize: isOpen ? '1rem' : '0.9rem', width: '100%' }}>
                        {tour.provinces.join(', ')} - {tour.tourCategory}
                    </Typography>
                    <Typography component="div" variant="h6" sx={{ fontSize: isOpen ? '1.5rem' : '1.27rem', wordSpacing: -2, 
                        textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', 
                        lineHeight: 1.5, height: isOpen ? '4.55rem' : '3.8rem' }}>
                        {tour.tourName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center', fontSize: isOpen ? '1.05rem' : '1rem', mb: 2 }}>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            Thời lượng: {tour.duration}
                        </Box>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', pb: 1, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button variant="outlined" component={Link} to={currentPage + "/chi-tiet/" + tour.tourTemplateId}
                                sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, color: 'gray', borderColor: 'gray', mr: 1 }}>
                                Chi tiết
                            </Button>
                        </Box>
                        <Typography sx={{
                            alignItems: 'center',
                            fontSize: isOpen ? '1.05rem' : '1rem',
                            color: getStatusColor(tour.status),
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 700
                        }}>
                            {tour.statusName}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default TourTemplateCard;
