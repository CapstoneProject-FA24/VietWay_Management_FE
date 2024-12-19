import React, { useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, IconButton, useTheme, useMediaQuery, Chip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { CalendarToday, Category, Launch, AddBoxOutlined } from '@mui/icons-material';
import { getTourTemplateStatusInfo } from '@services/StatusService';
import { getCookie } from '@services/AuthenService';

const TourTemplateCard = ({ tour, isOpen }) => {
    const theme = useTheme();
    const isApproved = tour.status === 2;

    const location = useLocation();
    const currentPage = location.pathname;

    return (
        <Card sx={{
            display: 'flex', flexDirection: 'column', height: '100%',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            bgcolor: 'background.paper', position: 'relative',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[4] }
        }}>
            <Chip
                label={tour.statusName} size="small"
                sx={{
                    color: getTourTemplateStatusInfo(tour.status).color,
                    bgcolor: getTourTemplateStatusInfo(tour.status).backgroundColor,
                    position: 'absolute', top: 12, left: 12, boxShadow: '1px 1px 4px 1px rgb(0, 0, 0, 0.2)',
                    fontWeight: 700, borderRadius: 5, padding: '4px'
                }}
            />
            <CardMedia
                component="img"
                sx={{
                    minWidth: '100%',
                    height: '200px',
                    objectFit: 'cover'
                }}
                image={tour.imageUrl ? tour.imageUrl : '/no-image.jpg'}
            />
            <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        <CalendarToday sx={{ fontSize: '1rem' }} />
                        {new Date(tour.createdDate).toLocaleDateString('vi-VN')}
                    </Box>
                    <Chip
                        icon={<Category sx={{ fontSize: '1rem' }} />}
                        label={tour.tourCategory}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                            height: '28px',
                            '& .MuiChip-label': { fontSize: '0.8rem', fontWeight: 600 },
                            borderRadius: 5, pl: 0.5, pr: 0.5
                        }}
                    />
                </Box>
                <Typography component="div" variant="h6" sx={{ fontWeight: 600, fontSize: '1.4rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mt: -1, lineHeight: 1.2 }}>
                    {tour.tourName ? tour.tourName : 'Không có tên'}
                </Typography>
                <Typography noWrap variant="body1" color="text.secondary" sx={{ textOverflow: 'ellipsis', mb: -1 }}>
                    <strong>Mã tour:</strong> {tour.code}
                </Typography>
                <Typography noWrap variant="body1" color="text.secondary" sx={{ textOverflow: 'ellipsis', mb: -1 }}>
                    <strong>Thời lượng:</strong> {tour.duration}
                </Typography>
                <Typography noWrap variant="body1" color="text.secondary" sx={{ textOverflow: 'ellipsis', mb: -1 }}>
                    <strong>Tour đi:</strong> {tour.provinces?.join(' - ')}
                </Typography>
                <Typography noWrap variant="body1" color="text.secondary" sx={{ textOverflow: 'ellipsis', mb: -1 }}>
                    <strong>Khời hành từ:</strong> {tour.startingProvince}
                </Typography>
                <Typography noWrap variant="body1" color="text.secondary" sx={{ textOverflow: 'ellipsis' }}>
                    <strong>Phương tiện:</strong> {tour.transportation}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 'auto', pt: 1 }}>

                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Button variant="outlined" component={Link} to={`/${getCookie("role")}/tour-mau/chi-tiet/${tour.tourTemplateId}`} endIcon={<Launch />}
                            sx={{
                                borderRadius: theme.shape.borderRadius, textTransform: 'none', px: 2,
                                fontSize: '0.85rem', backgroundColor: 'transparent', color: 'primary.main',
                                borderColor: 'primary.main', border: '1px solid'
                            }}
                        >
                            Chi tiết
                        </Button>
                        {(isApproved && getCookie("role") === "nhan-vien") && (
                            <Button
                                variant="contained" component={Link} endIcon={<AddBoxOutlined />}
                                to={"/nhan-vien/tour-du-lich/tour-mau-duoc-duyet/tao-tour/" + tour.tourTemplateId}
                                sx={{
                                    fontSize: '0.85rem', borderRadius: theme.shape.borderRadius, textTransform: 'none',
                                    fontWeight: 600, px: 2, boxShadow: 'none', '&:hover': { boxShadow: theme.shadows[2] }
                                }}
                            >
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
