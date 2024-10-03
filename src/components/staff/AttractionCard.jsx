import React, { useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const AttractionCard = ({ attraction, isOpen, onOpenDeletePopup }) => {
    const location = useLocation();
    const currentPage = location.pathname;

    const handleDelete = () => {
        onOpenDeletePopup(attraction);
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
                sx={{ minWidth: '40%', width: '40%', height: isOpen ? '14.5rem' : '12.5rem', borderRadius: 1.5 }}
                image={attraction.attractionImages[0].url}
                alt={attraction.attractionImages[0].alt}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '60%', width: '60%' }}>
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', pl: '1rem' }}>
                    <Typography variant="h1" color="primary" component="div" sx={{ fontSize: isOpen ? '1.5rem' : '1.2rem' }}>
                        Mã: {attraction.attractionId}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography color="text.secondary" component="div" sx={{ fontSize: isOpen ? '0.95rem' : '0.85rem', textAlign: 'right' }}>
                            Tạo ngày: {new Date(attraction.createdDate).toLocaleDateString()}
                        </Typography>
                        <Typography color="text.secondary" component="div" sx={{ fontSize: isOpen ? '0.95rem' : '0.85rem', textAlign: 'right' }}>
                            Tạo bởi: {attraction.creatorName}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: '0.5rem', mt: isOpen ? -1 : -2, ml: '0.5rem' }}>
                    <Typography noWrap color="text.secondary" component="div" sx={{ fontSize: isOpen ? '1rem' : '0.9rem', width: '100%' }}>
                        {attraction.attractionType}
                    </Typography>
                    <Typography noWrap component="div" variant="h6" sx={{ fontSize: isOpen ? '1.60rem' : '1.3rem', textOverflow: 'ellipsis', mt: -1 }}>
                        {attraction.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center', fontSize: isOpen ? '1.05rem' : '1rem' }}>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mt: 0.5, mb: 0.5 }}>
                            Địa chỉ: {attraction.address}
                        </Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center', fontSize: isOpen ? '1.05rem' : '1rem' }}>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mt: 0.5, mb: 0.5, height: '3rem' }}>
                            {attraction.description}
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
                            <Button variant="outlined" component={Link} to={currentPage + "/sua/" + attraction.attractionId}
                                sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, mr: 1 }}>
                                Sửa
                            </Button>
                            <Button variant="outlined" component={Link} to={currentPage + "/chi-tiet/" + attraction.attractionId}
                                sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, color: 'gray', borderColor: 'gray', mr: 1 }}>
                                Chi tiết
                            </Button>
                        </Box>
                        <Typography sx={{
                            alignItems: 'center',
                            fontSize: isOpen ? '1.05rem' : '1rem',
                            color: getStatusColor(attraction.status),
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 700
                        }}>
                            {attraction.statusName}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default AttractionCard;
