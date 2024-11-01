import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, Chip, useTheme, useMediaQuery } from '@mui/material';
import { CalendarToday, Category, Launch } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status) => {
  switch(status) {
    case '0': return { color: 'warning', label: 'Bản nháp' };
    case '1': return { color: 'info', label: 'Chờ duyệt' };
    case '2': return { color: 'success', label: 'Đã duyệt' };
    case '3': return { color: 'error', label: 'Từ chối' };
    default: return { color: 'default', label: 'Không xác định' };
  }
};

const PostsCard = ({ post }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const statusInfo = getStatusColor(post.status);

  const handleViewDetails = (postId) => {
    navigate(`/nhan-vien/bai-viet/${postId}`);
  };

  return (
    <Card
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', 
        borderRadius: theme.shape.borderRadius, transition: 'all 0.2s ease', 
        bgcolor: 'background.paper', position: 'relative', 
        '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[3] } }}
    >
      <Chip label={statusInfo.label} color={statusInfo.color} size="small" 
        sx={{ position: 'absolute' }} 
      />

      <CardMedia component="img" height={isMobile ? "140" : "180"} image={post.image || 'default-image.jpg'}
        alt={post.title} sx={{ objectFit: 'cover',}}/>

      <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
            <CalendarToday sx={{ fontSize: '0.9rem' }} />
            {new Date(post.createDate).toLocaleDateString('vi-VN')}
          </Box>
          <Chip icon={<Category sx={{ fontSize: '0.9rem' }} />} label={post.category} size="small" color="primary" variant="outlined" 
            sx={{ height: '24px', '& .MuiChip-label': { fontSize: '0.75rem' } }} 
          />
        </Box>

        <Typography 
          variant={isMobile ? "h6" : "h5"}
          sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' } }}
          overflow="hidden"
          display="-webkit-box"
          WebkitLineClamp="2"
          WebkitBoxOrient="vertical"
          color="text.primary"
        >
          {post.title}
        </Typography>
        <Typography 
          color="text.secondary"
          sx={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', fontSize: { xs: '0.8rem', sm: '0.85rem' }, flexGrow: 1, mb: 1 }}>
          {post.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
          <Button variant="contained" size={isMobile ? "small" : "medium"} 
          onClick={() => handleViewDetails(post.id)} endIcon={<Launch />}
            sx={{ borderRadius: theme.shape.borderRadius, textTransform: 'none', px: isMobile ? 1.5 : 2, fontSize: '0.875rem' }}
          >
            Chi tiết
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostsCard;
