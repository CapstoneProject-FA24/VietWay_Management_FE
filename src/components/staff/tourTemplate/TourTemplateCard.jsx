import React, { useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, IconButton, useTheme, useMediaQuery, Chip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { CalendarToday, Category, Launch } from '@mui/icons-material';
import { getTourTemplateStatusInfo } from '@services/StatusService';

const TourTemplateCard = ({ tour, isOpen, onOpenDeletePopup }) => {
    const theme = useTheme();

    const isDraft = tour.status === 0;
    const isEditable = tour.status !== 2 && tour.status !== 1;
    const isApproved = tour.status === 2;

    const location = useLocation();
    const currentPage = location.pathname;

    const handleDelete = () => {
        onOpenDeletePopup(tour);
    };

    return (
        <Card sx={{
            display: 'flex', flexDirection: 'column',
            borderRadius: 2, transition: 'all 0.2s ease',
            bgcolor: 'background.paper', position: 'relative',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[3] }
        }}>
            <Chip
                label={tour.statusName} size="small"
                sx={{
                    color: getTourTemplateStatusInfo(tour.status).color, bgcolor: getTourTemplateStatusInfo(tour.status).backgroundColor,
                    position: 'absolute', top: 10, left: 10, fontWeight: 600
                }}
            />
            <CardMedia
                component="img"
                sx={{
                    minWidth: '100%',
                    height: '200px',
                    objectFit: 'cover'
                }}
                image={tour.imageUrl}
            />
            <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                        <CalendarToday sx={{ fontSize: '0.9rem' }} />
                        {new Date(tour.createdDate).toLocaleDateString('vi-VN')}
                    </Box>
                    <Chip icon={<Category />} label={tour.tourCategory} size="small" color="primary" variant="outlined"
                        sx={{ height: '25px', '& .MuiChip-label': { fontSize: '0.75rem' }, p: 0.5 }}
                    />
                </Box>
                <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mt: 0.3 }}>
                {tour.provinces.join(' - ')}
                </Typography>
                <Typography component="div" variant="h6" sx={{ fontSize: '1.4rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mt: -1 }}>
                    {tour.tourName ? tour.tourName : 'Không có tên'}
                </Typography>
                <Typography noWrap component="div" variant="h6" sx={{ fontSize: '1.5rem', textOverflow: 'ellipsis' }}>
                    Mã: {tour.code}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Thời lượng: {tour.duration}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={handleDelete}
                            sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, color: 'red', borderColor: 'red', mr: 1 }}
                        >
                            Xóa
                        </Button>
                        {isEditable && (
                            <Button variant="outlined" component={Link} to={currentPage + "/sua/" + tour.tourTemplateId}
                                sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, mr: 1 }}>
                                Sửa
                            </Button>
                        )}
                        <Button variant="outlined" component={Link} to={currentPage + "/chi-tiet/" + tour.tourTemplateId}
                            sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, color: 'gray', borderColor: 'gray', mr: 1 }}>
                            Chi tiết
                        </Button>
                        {isApproved && (
                            <Button variant="contained" component={Link}
                                to={"/nhan-vien/tour-du-lich/tour-mau-duoc-duyet/tao-tour/" + tour.tourTemplateId}
                                sx={{ fontSize: isOpen ? '0.9rem' : '0.75rem', borderRadius: 1.5, color: 'white', borderColor: 'gray' }}>
                                Tạo tour
                            </Button>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TourTemplateCard;
