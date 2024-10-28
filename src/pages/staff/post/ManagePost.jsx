import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Container } from '@mui/material';
import PostsCard from '@components/staff/posts/PostsCard';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchPosts } from '@hooks/MockPost';

const ManagePost = () => {
  const [posts, setPosts] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchPosts().then((data) => {
      setPosts(data);
    });
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleViewDetails = (postId) => {
    console.log('View details for post:', postId);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />

      <Box sx={{ flexGrow: 1, mt: 1.5, p: isSidebarOpen ? 3 : 3, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '280px' : '20px' }}>
        <Grid item xs={12} md={9} sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}> Quản lý bài đăng </Typography>
        </Grid>

        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostsCard
                post={post}
                onViewDetails={() => handleViewDetails(post.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ManagePost;
