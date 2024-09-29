import React, { useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const TourTemplateCard = ({ tour, isOpen, onOpenDeletePopup }) => {
    const isDraft = tour.Status === 0;
    const isEditable = tour.Status !== 2 && tour.Status !== 1;
    const isApproved = tour.Status === 2;

    const location = useLocation();
    const currentPage = location.pathname;

    const handleDelete = () => {
        onOpenDeletePopup(tour);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 0: return '#5d5d5d';
            case 1: return 'primary.main';
            case 2: return 'green';
            case 3: return 'red';
            default: return 'black';
        }
    };

    return (
        <Card sx={{ display: 'flex', height: isOpen ? '15.9rem' : '13.9rem', p: '0.7rem', borderRadius: 1.5 }}>
            <CardMedia
                component="img"
                sx={{ width: '33%', height: isOpen ? '14.5rem' : '12.5rem', borderRadius: 1.5 }}
                image={tour.TourTemplateImage}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '67%' }}>
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', pl: '1rem', mb: 1.5 }}>
                    <Typography variant="h1" color="primary" component="div" sx={{ fontSize: isOpen ? '1.5rem' : '1.2rem' }}>
                        Mã: {tour.TourCode}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography color="text.secondary" component="div" sx={{ fontSize: isOpen ? '0.95rem' : '0.85rem', textAlign: 'right' }}>
                            Tạo ngày: {new Date(tour.CreatedDate).toLocaleDateString()}
                        </Typography>
                        <Typography color="text.secondary" component="div" sx={{ fontSize: isOpen ? '0.95rem' : '0.85rem', textAlign: 'right' }}>
                            Tạo bởi: {tour.CreatedBy}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: '0.5rem', mt: isOpen ? 0 : -1, ml: '0.5rem' }}>
                    <Typography noWrap color="text.secondary" component="div" sx={{ fontSize: isOpen ? '1rem' : '0.9rem', width: '100%' }}>
                        {tour.TourTemplateProvinces.map(province => province.ProvinceName).join(', ')} - {tour.TourCategory}
                    </Typography>
                    <Typography noWrap component="div" variant="h6" sx={{ fontSize: isOpen ? '1.60rem' : '1.3rem', wordSpacing: -2, textOverflow: 'ellipsis' }}>
                        {tour.TourName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center', fontSize: isOpen ? '1.05rem' : '1rem' }}>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            Thời lượng: {tour.Duration}
                        </Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', fontSize: isOpen ? '1.05rem' : '1rem' }}>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            Khởi hành từ: {tour.DeparturePoint? tour.DeparturePoint : "Meicheng"}
                        </Box>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', pb: 1, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button 
                                variant="outlined"
                                onClick={handleDelete}
                                sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, color: 'red', borderColor: 'red', mr: 1 }}
                            >
                                Xóa
                            </Button>
                            {isEditable && (
                                <Button variant="outlined" component={Link} to={currentPage + "/sua/" + tour.TourTemplateId}
                                    sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, mr: 1 }}>
                                    Sửa
                                </Button>
                            )}
                            <Button variant="outlined" component={Link} to={currentPage + "/chi-tiet/" + tour.TourTemplateId}
                                sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, color: 'gray', borderColor: 'gray', mr: 1 }}>
                                Chi tiết
                            </Button>
                            {isApproved && (
                                <Button variant="contained"
                                    sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, color: 'white', borderColor: 'gray' }}>
                                    Tạo tour
                                </Button>
                            )}
                        </Box>
                        <Typography sx={{
                            alignItems: 'center',
                            fontSize: isOpen ? '1.05rem' : '1rem',
                            color: getStatusColor(tour.Status),
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 700
                        }}>
                            {tour.StatusName}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default TourTemplateCard;
