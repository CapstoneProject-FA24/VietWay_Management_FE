import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Button, TextField, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { ArrowBack, Edit, Delete, Save, Send, CheckCircle } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import SidebarManager from '@layouts/SidebarManager';
import { fetchPostById, deletePost } from '@services/PostService';
import { getPostStatusInfo } from '@services/StatusService';
import 'react-quill/dist/quill.snow.css';
import { PostStatus } from '@hooks/Statuses';
import PostDeleteConfirm from '@components/post/PostDeleteConfirm';
import { updatePost } from '@services/PostService';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import { Helmet } from 'react-helmet';

const ManagerPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPostById(id);
        setPost(data);
      } catch (error) {
        console.error('Error loading post:', error);
        setSnackbar({
          open: true,
          message: 'Không thể tải bài viết',
          severity: 'error'
        });
      }
    };
    loadPost();
  }, [id]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleApprovePost = async () => {
    try {
      await updatePost(post.postId, { status: PostStatus.Approved });
      setSnackbar({
        open: true,
        message: 'Bài viết đã được duyệt',
        severity: 'success'
      });
      const updatedPost = await fetchPostById(id);
      setPost(updatedPost);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi duyệt bài viết',
        severity: 'error'
      });
    }
  };

  const renderActionButtons = () => {
    switch (post.status) {
      case PostStatus.Pending:
        return (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" startIcon={<CheckCircle />} onClick={handleApprovePost} sx={{ height: 'fit-content' }}>
              Duyệt
            </Button>
            <Button variant="contained" color="error" startIcon={<Delete />} onClick={handleDeletePost} sx={{ height: 'fit-content' }}>
              Xóa
            </Button>
          </Box>
        );
      case PostStatus.Approved:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <Button variant="contained" color="error" startIcon={<Delete />} onClick={handleDeletePost} sx={{ height: 'fit-content' }}>
              Xóa
            </Button>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography>
                Đăng bài:
              </Typography>
              <Button
                variant="contained"
                startIcon={<FacebookIcon />}
                onClick={() => handleShareToSocial('facebook')}
                sx={{
                  backgroundColor: '#1877F2', height: 'fit-content',
                  '&:hover': { backgroundColor: '#0d6efd' }
                }}
              >
                Facebook
              </Button>
              <Button
                variant="contained"
                startIcon={<XIcon />}
                onClick={() => handleShareToSocial('twitter')}
                sx={{
                  backgroundColor: '#000000',
                  '&:hover': { backgroundColor: '#2c2c2c' }
                }}
              >
                Twitter
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  const handleDeletePost = async () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async (postId) => {
    try {
      await deletePost(postId);
      setSnackbar({
        open: true,
        message: 'Bài viết đã được xóa',
        severity: 'success'
      });
      navigate(`/quan-ly/bai-viet`);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi xóa bài viết: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleShareToSocial = (platform) => {
    const url = encodeURIComponent(window.location.origin + '/posts/' + post.postId);
    const text = encodeURIComponent(post.title);

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    }
  };

  if (!post) return null;

  const statusInfo = getPostStatusInfo(post.status);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Helmet>
        <title>Chi tiết bài viết</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarManager isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />

        <Box sx={{ flexGrow: 1, p: 3, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '260px' : '20px', mt: 6 }}>
          <Box maxWidth="89vw">
            <Box elevation={2} sx={{ p: 1, mb: 3, marginTop: -6, height: '100%', width: isSidebarOpen ? 'calc(95vw - 260px)' : 'calc(95vw - 20px)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate(-1)}
                  sx={{ mb: 2, height: 'fit-content' }}
                >
                  Quay lại
                </Button>
                {renderActionButtons()}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={statusInfo.text} size="small" sx={{ mb: 1, color: `${statusInfo.color}`, bgcolor: `${statusInfo.backgroundColor}`, fontWeight: 600 }} />
                </Box>
                <img src={post.imageUrl} alt={post.title}
                  style={{ width: '100%', height: '25rem', objectFit: 'cover' }} />
                <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 700, color: '#1A1A1A', mb: 3, lineHeight: 1.2, letterSpacing: '-0.02em', fontFamily: '"Tinos", serif', marginTop: 3 }}>
                  {post.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faTag} style={{ color: '#666' }} />
                    <Chip label={post.postCategoryName}
                      sx={{
                        bgcolor: '#f5f5f5', color: '#666', fontWeight: 500,
                        '&:hover': { bgcolor: '#eeeeee' }
                      }} />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faMapLocation} style={{ color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                      {post.provinceName}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  sx={{
                    '& img': { width: '100%', height: 'auto', borderRadius: '4px', my: 2 },
                    '& p': { lineHeight: 1.7, mb: 2 }, flexGrow: 1, width: '90%', margin: '0 auto'
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {renderActionButtons()}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <PostDeleteConfirm
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        postId={post.postId}
        onDelete={handleConfirmDelete}
      />
    </Box>
  );
};

export default ManagerPostDetail;
