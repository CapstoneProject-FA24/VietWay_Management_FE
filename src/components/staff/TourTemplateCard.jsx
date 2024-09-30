import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const TourTemplateCard = ({ tour, isOpen, onOpenDeletePopup }) => {
    const isDraft = tour.status === 0;
    const isEditable = tour.status !== 2 && tour.status !== 1;
    const isApproved = tour.status === 2;

    const location = useLocation();
    const currentPage = location.pathname;

    const truncateTourName = (name, maxLength) => {
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

    const handleDelete = () => {
        onOpenDeletePopup(tour);
    };

    const getStatusText = (status) => {
        switch(status) {
            case 0: return 'Bản nháp';
            case 1: return 'Chờ duyệt';
            case 2: return 'Đã duyệt';
            case 3: return 'Đã bị từ chối';
            default: return 'Không xác định';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 0: return 'blue';
            case 1: return 'orange';
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
                image={tour.imageUrl}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100%' }}>
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
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: '0.5rem', mt: isOpen ? 0 : -1, ml: '0.5rem' }}>
                    <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ fontSize: isOpen ? '1rem' : '0.9rem' }}>
                        {tour.provinces.join(', ')} - Tour Category {tour.tourCategoryId}
                    </Typography>
                    <Typography noWrap component="div" variant="h6" sx={{ fontSize: isOpen ? '1.60rem' : '1.3rem', wordSpacing: -2 }}>
                        {truncateTourName(tour.tourName, isOpen ? 50 : 35)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center', fontSize: isOpen ? '1.05rem' : '1rem' }}>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            Thời lượng: {tour.duration}
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
                                <Button variant="outlined" component={Link} to={`${currentPage}/sua/${tour.tourTemplateId}`}
                                    sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, mr: 1 }}>
                                    Sửa
                                </Button>
                            )}
                            <Button variant="outlined" component={Link} to={`${currentPage}/chi-tiet/${tour.tourTemplateId}`}
                                sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, color: 'gray', borderColor: 'gray', mr: 1 }}>
                                Chi tiết
                            </Button>
                            {isApproved && (
                                <Button variant="contained" component={Link}
                                    to={`${currentPage}/tao-tour/${tour.tourTemplateId}`}
                                    sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, color: 'white', borderColor: 'gray' }}>
                                    Tạo tour
                                </Button>
                            )}
                        </Box>
                        <Typography sx={{
                            alignItems: 'center',
                            fontSize: isOpen ? '1.05rem' : '1rem',
                            color: getStatusColor(tour.status),
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 700
                        }}>
                            {getStatusText(tour.status)}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default TourTemplateCard;