import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Button, TextField, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { ArrowBack, Edit, Delete, Save, Send, CheckCircle } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import SidebarManager from '@layouts/SidebarManager';
import { fetchPostById, deletePost } from '@services/PostService';
import { fetchProvinces } from '@services/ProvinceService';
import { getPostStatusInfo } from '@services/StatusService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { PostStatus } from '@hooks/Statuses';
import { fetchPostCategory } from '@services/PostCategoryService';
import PostDeleteConfirm from '@components/staff/posts/PostDeleteConfirm';
import { updatePost } from '@services/PostService';
import PublishIcon from '@mui/icons-material/Publish';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';

const commonStyles = {
  boxContainer: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 },

  flexContainer: { display: 'flex', alignItems: 'center', flex: 1, width: '80%' },

  labelTypography: {
    color: '#05073C',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    marginRight: '1rem'
  },

  inputField: {
    '& .MuiOutlinedInput-root': {
      height: '40px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 14px'
    }
  },

  imageContainer: { mb: 2, flexGrow: 1, position: 'relative', '&:hover .overlay': { opacity: 1 }, '&:hover .change-image-btn': { opacity: 1 } },

  editorContainer: {
    '& .ql-container': {
      minHeight: '200px',
      fontSize: '1.1rem'
    },
    '& .ql-editor': {
      minHeight: '200px',
      fontSize: '1.1rem'
    },
    contentDisplay: { display: 'flex', flexDirection: 'column', maxWidth: '80vw', overflow: 'auto' }
  }
};

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
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [editablePost, setEditablePost] = useState(null);
  const [editableFields, setEditableFields] = useState({});

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPostById(id);
        setPost(data);
        setEditablePost({
          ...data,
          category: data.postCategoryName,
          postCategoryId: data.postCategoryId,
          provinceId: data.provinceId,
          provinceName: data.provinceName,
          image: data.imageUrl,
          content: data.content
        });
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

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const categories = await fetchPostCategory();
        setCategoryOptions(categories.map(cat => ({
          postCategoryId: cat.postCategoryId,
          name: cat.name
        })));
      } catch (error) {
        console.error('Error loading categories:', error);
        setSnackbar({
          open: true,
          message: 'Không thể tải danh mục',
          severity: 'error'
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const provinces = await fetchProvinces();
        setProvinceOptions(provinces.map(province => ({
          value: province.provinceId,
          label: province.provinceName
        })));
      } catch (error) {
        console.error('Error loading provinces:', error);
        setSnackbar({
          open: true,
          message: 'Không thể tải danh sách tỉnh thành',
          severity: 'error'
        });
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  useEffect(() => {
    if (post) {
      setEditableFields({
        title: { value: post.title || '', isEditing: false },
        content: { value: post.content || '', isEditing: false },
        description: { value: post.description || '', isEditing: false },
        category: { value: post.category || '', isEditing: false },
        provinceId: { value: post.provinceId || '', isEditing: false },
        provinceName: { value: post.provinceName || '', isEditing: false },
        createDate: { value: post.createDate || '', isEditing: false },
        image: { value: post.image || '', isEditing: false },
        status: { value: post.status || '0', isEditing: false }
      });
    }
  }, [post]);

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
      navigate(`/nhan-vien/bai-viet`);
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
                  <Chip label={statusInfo.label} color={statusInfo.color} size="small" sx={{ mb: 1.5 }} />
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
