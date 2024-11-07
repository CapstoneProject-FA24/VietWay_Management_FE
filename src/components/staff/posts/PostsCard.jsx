import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, Chip, useTheme, useMediaQuery } from '@mui/material';
import { CalendarToday, Category, Launch } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getPostStatusInfo } from '@services/StatusService';
const PostsCard = ({ post }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        height: '100%', display: 'flex', flexDirection: 'column',
        borderRadius: 2, transition: 'all 0.2s ease',
        bgcolor: 'background.paper', position: 'relative',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[3] }
      }}
    >
      <Chip label={getPostStatusInfo(post.status).text} size="small" sx={{ mb: 1, color: `${getPostStatusInfo(post.status).color}`, bgcolor: `${getPostStatusInfo(post.status).backgroundColor}`, position: 'absolute', top: 10, left: 10, fontWeight: 600 }} />

      <CardMedia component="img" height={isMobile ? "140" : "180"} image={post.image === null ? '/no-image-available.png' : post.image}
        alt={post.title} sx={{ objectFit: 'cover', }} />

      <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
            <CalendarToday sx={{ fontSize: '0.9rem' }} />
            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
          </Box>
          <Chip icon={<Category sx={{ fontSize: '0.9rem' }} />} label={post.category} size="small" color="primary" variant="outlined"
            sx={{ height: '25px', '& .MuiChip-label': { fontSize: '0.75rem' }, p: 0.5 }}
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
          sx={{
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', fontSize: { xs: '0.8rem', sm: '0.85rem' }, flexGrow: 1, mb: 1
          }}>
          {post.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" component={Link} to={`/nhan-vien/bai-viet/chi-tiet/${post.postId}`} endIcon={<Launch />}
            sx={{
              borderRadius: theme.shape.borderRadius, textTransform: 'none', px: isMobile ? 1.5 : 2,
              fontSize: '0.875rem', backgroundColor: 'transparent', color: 'primary.main',
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

export default PostsCard;
