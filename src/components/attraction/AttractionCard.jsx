import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, Chip, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAttractionStatusInfo } from '@services/StatusService';
import { CalendarToday, Category, Launch } from '@mui/icons-material';
import { getCookie } from '@services/AuthenService';

const AttractionCard = ({ attraction, isOpen, onOpenDeletePopup }) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                display: 'flex', flexDirection: 'column', height: '100%',
                borderRadius: 2, transition: 'all 0.2s ease',
                bgcolor: 'background.paper', position: 'relative',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[3] }
            }}
        >
            <Chip label={getAttractionStatusInfo(attraction.status).text} size="small" sx={{ mb: 1, color: `${getAttractionStatusInfo(attraction.status).color}`, bgcolor: `${getAttractionStatusInfo(attraction.status).backgroundColor}`, position: 'absolute', top: 10, left: 10, fontWeight: 600 }} />
            <CardMedia
                component="img"
                sx={{ minWidth: '100%', height: '200px', objectFit: 'cover' }}
                image={attraction.imageUrl ? attraction.imageUrl : '/no-image-available.png'}
                alt={attraction.name}
            />
            <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                        <CalendarToday sx={{ fontSize: '0.9rem' }} />
                        {new Date(attraction.createdDate).toLocaleDateString('vi-VN')}
                    </Box>
                    <Chip icon={<Category />} label={attraction.attractionType} size="small" color="primary" variant="outlined"
                        sx={{ height: '25px', '& .MuiChip-label': { fontSize: '0.75rem' }, p: 0.5 }}
                    />
                </Box>
                <Typography color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mt: 0.3 }}>
                    {attraction.province}
                </Typography>
                <Typography component="div" variant="h6" sx={{ fontWeight: 600, fontSize: '1.4rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mt: -1 }}>
                    {attraction.name ? attraction.name : 'Không có tên'}
                </Typography>
                <Typography variant="body1" color="text.secondary" component="div" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', mb: 3 }}>
                    Địa chỉ: {attraction.address ? attraction.address : 'Không có địa chỉ'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', bottom: 10, right: 10 }}>
                    <Button variant="outlined" component={Link} to={ `/${getCookie("role")}/diem-tham-quan/chi-tiet/${attraction.attractionId}`} endIcon={<Launch />}
                        sx={{
                            borderRadius: theme.shape.borderRadius, fontSize: '0.875rem', backgroundColor: 'transparent', color: 'primary.main',
                            borderColor: 'primary.main', border: '1px solid'
                        }}
                    >
                        Chi tiết
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AttractionCard;
