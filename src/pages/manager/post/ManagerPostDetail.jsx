import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip, CircularProgress, IconButton, Select, MenuItem, FormControl, FormHelperText, InputLabel, Collapse, Paper } from '@mui/material';
import { ArrowBack, Delete, Edit, Cancel, Save } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import SidebarManager from '@layouts/SidebarManager';
import { fetchPostById, deletePost, sharePostOnFacebook, sharePostOnTwitter, getTwitterReactionsByPostId, changePostStatus, getFacebookReactionsByPostId, updatePost, updatePostImages } from '@services/PostService';
import { getPostStatusInfo } from '@services/StatusService';
import 'react-quill/dist/quill.snow.css';
import { PostStatus } from '@hooks/Statuses';
import PostDeleteConfirm from '@components/post/PostDeleteConfirm';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import { Helmet } from 'react-helmet';
import HistoryIcon from '@mui/icons-material/History';
import VersionHistory from '@components/common/VersionHistory';
import ReactQuill from 'react-quill';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchPostCategory } from '@services/PostCategoryService';

const ManagerPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', hide: 5000, });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isApprovePopupOpen, setIsApprovePopupOpen] = useState(false);
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [socialMetrics, setSocialMetrics] = useState({ twitter: null, facebook: null });
  const [isPublishing, setIsPublishing] = useState({ facebook: false, twitter: false });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editablePost, setEditablePost] = useState(null);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const loadPost = async () => {
    try {
      const data = await fetchPostById(id);
      setPost(data);
      setFieldErrors({});
      const categories = await fetchPostCategory();
      setCategoryOptions(categories.map(cat => ({
        postCategoryId: cat.postCategoryId,
        name: cat.name
      })));
      const provinces = await fetchProvinces({ pageSize: 63, pageIndex: 1 });
      setProvinceOptions(provinces.items.map(province => ({
        value: province.provinceId,
        label: province.provinceName
      })));
    } catch (error) {
      console.error('Error loading data:', error);
      setSnackbar({ open: true, message: 'Lỗi tải thông tin', severity: 'error', hide: 5000 });
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  useEffect(() => {
    const fetchTwitterReactions = async () => {
      if (post?.xTweetId) {
        try {
          const data = await getTwitterReactionsByPostId(post.postId);
          if (data) {
            setSocialMetrics(prev => ({
              ...prev,
              twitter: {
                likeCount: data.likeCount, retweetCount: data.retweetCount,
                replyCount: data.replyCount, impressionCount: data.impressionCount,
                quoteCount: data.quoteCount, bookmarkCount: data.bookmarkCount
              }
            }));
          }
        } catch (error) {
          console.error('Error fetching Twitter reactions:', error);
          setSocialMetrics(prev => ({
            ...prev,
            twitter: {
              likeCount: 0, retweetCount: 0, replyCount: 0, impressionCount: 0, quoteCount: 0, bookmarkCount: 0
            }
          }));
        }
      }
    };
    fetchTwitterReactions();
    const interval = setInterval(fetchTwitterReactions, 30000);
    return () => clearInterval(interval);
  }, [post?.postId, post?.xTweetId]);

  useEffect(() => {
    const fetchFacebookReactions = async () => {
      if (post?.facebookPostId) {
        try {
          const data = await getFacebookReactionsByPostId(post.postId);
          if (data) {
            const totalReactions = data.postReactions ? Object.values(data.postReactions).reduce((sum, count) => sum + count, 0) : 0;

            setSocialMetrics(prev => ({
              ...prev,
              facebook: {
                reactionCount: totalReactions, reactionDetails: data.postReactions || {}, shareCount: data.shareCount,
                commentCount: data.commentCount, impressionCount: data.impressionCount
              }
            }));
          }
        } catch (error) {
          console.error('Error fetching Facebook reactions:', error);
          setSnackbar({ open: true, message: 'Không thể tải thông tin tương tác Facebook', severity: 'error', hide: 5000 });
        }
      }
    };
    fetchFacebookReactions();
    const interval = setInterval(fetchFacebookReactions, 30000);
    return () => clearInterval(interval);
  }, [post?.postId, post?.facebookPostId]);

  useEffect(() => {
    if (post) {
      setEditablePost({
        ...post,
        title: post.title || '',
        content: post.content || '',
        description: post.description || '',
        postCategoryId: post.postCategoryId || '',
        postCategoryName: post.postCategoryName || '',
        provinceId: post.provinceId || '',
        provinceName: post.provinceName || '',
        image: post.imageUrl || '',
      });
    }
  }, [post]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleApprove = async () => {
    try {
      await changePostStatus(post.postId, 2);
      setPost({ ...post, status: 2 });
      setSnackbar({ open: true, message: 'Bài viết đã được duyệt', severity: 'success', hide: 5000 });
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi khi duyệt bài viết', severity: 'error', hide: 5000 });
    } finally {
      setIsApprovePopupOpen(false);
    }
  };

  const handleReject = async () => {
    try {
      await changePostStatus(post.postId, 3, rejectReason);
      setPost({ ...post, status: 3 });
      setSnackbar({ open: true, message: 'Bài viết đã bị từ chối', severity: 'success', hide: 5000 });
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi khi từ chối bài viết', severity: 'error', hide: 5000 });
    } finally {
      setIsRejectPopupOpen(false);
      setRejectReason('');
    }
  };

  const handleEditPost = () => {
    setIsEditMode(true);
    setEditablePost({
      ...post,
      postCategoryId: post.postCategoryId, postCategoryName: post.postCategoryName,
      provinceId: post.provinceId, provinceName: post.provinceName, image: post.imageUrl
    });
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    try {
      const errors = {};
      if (!editablePost.title?.trim()) errors.title = 'Vui lòng nhập tiêu đề bài viết';
      if (!editablePost.description?.trim()) errors.description = 'Vui lòng nhập mô tả ngắn';
      if (!editablePost.content?.trim()) errors.content = 'Vui lòng nhập nội dung bài viết';
      else if (editablePost.content.length < 50) errors.content = 'Nội dung bài viết phải có ít nhất 50 ký tự';
      if (!editablePost.postCategoryId) errors.category = 'Vui lòng chọn danh mục';
      if (!editablePost.provinceId) errors.provinceId = 'Vui lòng chọn tỉnh thành';
      if (!editablePost.image) errors.image = 'Vui lòng chọn ảnh cho bài viết';

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setSnackbar({
          open: true,
          message: 'Vui lòng nhập đầy đủ và chính xác các thông tin',
          severity: 'warning',
          hide: 5000
        });
        return;
      }

      const updatedPost = {
        title: editablePost.title || null,
        content: editablePost.content || null,
        description: editablePost.description || null,
        postCategoryId: editablePost.postCategoryId || null,
        provinceId: editablePost.provinceId || null,
        isDraft: false
      };

      // First update the post content
      const response = await updatePost(id, updatedPost);

      if (!response || response.status !== 200) {
        throw new Error('Failed to update post content');
      }

      // If there's a new image, update it
      if (editablePost.imageFile) {
        const formData = new FormData();
        formData.append('images', editablePost.imageFile);

        const imagesResponse = await updatePostImages(id, formData);
        if (!imagesResponse || imagesResponse.statusCode !== 200) {
          throw new Error('Failed to update post image');
        }
      }

      // Update local state
      setPost(prevPost => ({
        ...prevPost,
        ...updatedPost,
        postCategoryName: categoryOptions.find(c => c.postCategoryId === updatedPost.postCategoryId)?.name,
        provinceName: provinceOptions.find(p => p.value === updatedPost.provinceId)?.label,
        imageUrl: editablePost.image
      }));

      setIsEditMode(false);
      setSnackbar({
        open: true,
        message: 'Đã cập nhật bài viết thành công',
        severity: 'success',
        hide: 1500
      });

      // Reload the post to get fresh data
      await loadPost();

    } catch (error) {
      console.error('Error updating post:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết',
        severity: 'error',
        hide: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    setIsCancelPopupOpen(true);
  };

  const handleCloseCancelPopup = () => {
    setIsCancelPopupOpen(false);
  };

  const handleCancelConfirm = () => {
    setIsEditMode(false);
    setIsCancelPopupOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditablePost(prev => ({
        ...prev,
        imageFile: file,
        image: URL.createObjectURL(file)
      }));
    }
  };

  const renderActionButtons = () => {
    switch (post.status) {
      case PostStatus.Pending:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
            <IconButton onClick={handleHistoryClick}
              sx={{
                backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': { backgroundColor: '#f5f5f5' }, mr: 2, height: '40px'
              }}
            > <HistoryIcon color="primary" /> </IconButton>
            <Button
              variant="contained" sx={{ width: 'fit-content', pl: 2, pr: 2, backgroundColor: 'primary.main' }}
              onClick={() => setIsApprovePopupOpen(true)}
            >
              Duyệt
            </Button>
            <Button
              variant="contained" sx={{ width: 'fit-content', pl: 2, pr: 2, backgroundColor: 'red' }}
              onClick={() => setIsRejectPopupOpen(true)}
            >
              Từ chối
            </Button>
          </Box>
        );
      case PostStatus.Approved:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handleHistoryClick}
                sx={{
                  backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': { backgroundColor: '#f5f5f5' }, mr: 2, height: '40px'
                }}
              > <HistoryIcon color="primary" /> </IconButton>
              {isEditMode ? (
                <>
                  <Button
                    variant="contained" startIcon={<Cancel />} onClick={handleCancelClick}
                    sx={{ backgroundColor: '#767676', '&:hover': { backgroundColor: '#575757' } }}
                  >
                    Hủy sửa
                  </Button>
                  <Button variant="contained" color="error" startIcon={<Delete />} onClick={handleDeletePost}> Xóa </Button>
                </>
              ) : (
                <>
                  <Button variant="contained" color="primary" startIcon={<Edit />} onClick={handleEditPost}> Sửa </Button>
                  <Button variant="contained" color="error" startIcon={<Delete />} onClick={handleDeletePost}> Xóa </Button>
                </>
              )}
            </Box>
            {((!post.xTweetId || !post.facebookPostId) && !isEditMode) && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography>Đăng bài:</Typography>
                {!post.facebookPostId && (
                  <Button
                    variant="contained" startIcon={isPublishing.facebook ? <CircularProgress size={20} color="inherit" /> : <FacebookIcon />}
                    onClick={() => handleShareToSocial('facebook')} disabled={isPublishing.facebook}
                    sx={{ backgroundColor: '#1877F2', height: 'fit-content', '&:hover': { backgroundColor: '#0d6efd' } }}
                  >
                    {isPublishing.facebook ? 'Đang đăng...' : 'Facebook'}
                  </Button>
                )}
                {!post.xTweetId && (
                  <Button
                    variant="contained" startIcon={isPublishing.twitter ? <CircularProgress size={20} color="inherit" /> : <XIcon />}
                    onClick={() => handleShareToSocial('twitter')} disabled={isPublishing.twitter}
                    sx={{ backgroundColor: '#000000', '&:hover': { backgroundColor: '#2c2c2c' } }}
                  >
                    {isPublishing.twitter ? 'Đang đăng...' : 'Twitter'}
                  </Button>
                )}
              </Box>
            )}
            {((post.xTweetId || post.facebookPostId) && !isEditMode) && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography>Xem bài đã đăng tại:</Typography>
                  {post.facebookPostId && (
                    <Button
                      variant="contained" startIcon={<FacebookIcon />} onClick={() => handleViewOnSocial('facebook')}
                      sx={{ backgroundColor: '#1877F2', height: 'fit-content', '&:hover': { backgroundColor: '#0d6efd' } }}
                    >
                      Facebook
                    </Button>
                  )}
                  {post.xTweetId && (
                    <Button
                      variant="contained" startIcon={<XIcon />} onClick={() => handleViewOnSocial('twitter')}
                      sx={{ backgroundColor: '#000000', '&:hover': { backgroundColor: '#2c2c2c' } }}
                    >
                      Twitter
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        );
      default:
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleHistoryClick}
              sx={{
                backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': { backgroundColor: '#f5f5f5' }, mr: 2, height: '40px'
              }}
            > <HistoryIcon color="primary" /> </IconButton>
          </Box>
        );
    }
  };

  const handleDeletePost = async () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async (postId) => {
    try {
      await deletePost(postId);
      setSnackbar({
        open: true, message: 'Xóa bài viết thành công', severity: 'success', hide: 1500
      });
      setTimeout(() => {
        navigate('/quan-ly/bai-viet/');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true, message: 'Lỗi khi xóa bài viết: ' + (error.response?.data?.message || error.message), severity: 'error', hide: 5000
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleShareToSocial = async (platform) => {
    setIsPublishing(prev => ({ ...prev, [platform]: true }));
    try {
      if (platform === 'facebook') {
        await sharePostOnFacebook(post.postId);
        setSnackbar({ open: true, message: 'Đã đăng bài viết lên Facebook thành công', severity: 'success', hide: 5000 });
      } else if (platform === 'twitter') {
        await sharePostOnTwitter(post.postId);
        setSnackbar({ open: true, message: 'Đã đăng bài viết lên Twitter thành công', severity: 'success', hide: 5000 });
      }
      const updatedPost = await fetchPostById(post.postId);
      setPost(updatedPost);
    } catch (error) {
      setSnackbar({
        open: true, severity: 'error', hide: 5000,
        message: `Lỗi khi đăng bài lên ${platform === 'facebook' ? 'Facebook' : 'Twitter'}: ${error.response?.data?.message || error.message}`,
      });
    } finally {
      setIsPublishing(prev => ({ ...prev, [platform]: false }));
    }
  };

  const handleViewOnSocial = (platform) => {
    let url;
    if (platform === 'facebook') {
      url = `https://www.facebook.com/${post.facebookPostId}`;
    } else if (platform === 'twitter') {
      url = `https://x.com/${import.meta.env.VITE_X_TWITTER_USERNAME}/status/${post.xTweetId}`;
    }
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleFieldChange = (field, value) => {
    setEditablePost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderSocialMetricsTable = () => (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'auto', my: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold', minWidth: '120px' }}>Nền tảng</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Lượt thích</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Đăng lại/Chia sẻ</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Bình luận/Trả lời</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Lượt xem</TableCell>
            {post.xTweetId && (
              <>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Trích dẫn</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Dấu trang</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {post.xTweetId && socialMetrics.twitter && (
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> <XIcon sx={{ fontSize: 20 }} /> Twitter </Box>
              </TableCell>
              <TableCell align="center">{socialMetrics.twitter.likeCount || 0}</TableCell>
              <TableCell align="center">{socialMetrics.twitter.retweetCount || 0}</TableCell>
              <TableCell align="center">{socialMetrics.twitter.replyCount || 0}</TableCell>
              <TableCell align="center">{socialMetrics.twitter.impressionCount || 0}</TableCell>
              <TableCell align="center">{socialMetrics.twitter.quoteCount || 0}</TableCell>
              <TableCell align="center">{socialMetrics.twitter.bookmarkCount || 0}</TableCell>
            </TableRow>
          )}
          {post.facebookPostId && socialMetrics.facebook && (
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> <FacebookIcon sx={{ fontSize: 20 }} /> Facebook </Box>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={
                  <Box>
                    {Object.entries(socialMetrics.facebook.reactionDetails).map(([type, count]) => (
                      <Typography key={type} variant="body2"> {type}: {count} </Typography>
                    ))}
                  </Box>
                }>
                  <span>{socialMetrics.facebook.reactionCount || 0}</span>
                </Tooltip>
              </TableCell>
              <TableCell align="center">{socialMetrics.facebook.shareCount || 0}</TableCell>
              <TableCell align="center">{socialMetrics.facebook.commentCount || 0}</TableCell>
              <TableCell align="center">{socialMetrics.facebook.impressionCount || 0}</TableCell>
              {post.xTweetId && (
                <> <TableCell align="center">-</TableCell> <TableCell align="center">-</TableCell> </>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );

  const handleHistoryClick = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const CancelConfirmationDialog = () => (
    <Dialog open={isCancelPopupOpen} onClose={handleCloseCancelPopup}>
      <DialogTitle sx={{ fontWeight: 600 }}> Xác nhận hủy </DialogTitle>
      <DialogContent> <Typography> Bạn có chắc chắn muốn hủy cập nhật? Các thay đổi sẽ không được lưu. </Typography> </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleCloseCancelPopup} sx={{ color: '#666666' }}> Không </Button>
        <Button onClick={handleCancelConfirm} variant="contained"
          sx={{ backgroundColor: '#DC2626', '&:hover': { backgroundColor: '#B91C1C' } }}
        > Có </Button>
      </DialogActions>
    </Dialog>
  );

  if (!post) return null;
  const statusInfo = getPostStatusInfo(post.status);
  const commonStyles = {
    boxContainer: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 },
    flexContainer: { display: 'flex', alignItems: 'center', flex: 1, width: '80%' },
    labelTypography: { color: '#05073C', fontWeight: 600, whiteSpace: 'nowrap', marginRight: '1rem' },
    inputField: {
      '& .MuiOutlinedInput-root': { height: '40px', },
      '& .MuiOutlinedInput-input': { padding: '8px 14px' }
    },
    imageContainer: { mb: 2, flexGrow: 1, position: 'relative', '&:hover .overlay': { opacity: 1 }, '&:hover .change-image-btn': { opacity: 1 } },
    editorContainer: {
      '& .ql-container': { minHeight: '200px', fontSize: '1.1rem' },
      '& .ql-editor': { minHeight: '200px', fontSize: '1.1rem' },
      contentDisplay: { display: 'flex', flexDirection: 'column', maxWidth: '80vw', overflow: 'auto' }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Helmet> <title>Chi tiết bài viết</title> </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarManager isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />
        <Box sx={{ flexGrow: 1, p: 3, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '260px' : '20px', mt: 6 }}>
          <Box maxWidth="89vw">
            <Box elevation={2} sx={{ p: 1, mb: 3, marginTop: -6, height: '100%', width: isSidebarOpen ? 'calc(95vw - 260px)' : 'calc(95vw - 20px)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2, height: 'fit-content' }} > Quay lại </Button>
                <Box sx={{ display: 'flex' }}>
                  <Collapse in={isHistoryOpen} timeout="auto" unmountOnExit
                    sx={{ position: 'absolute', top: 100, right: 30, width: '400px', zIndex: 1000 }}
                  >
                    <Paper elevation={3} sx={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }} >
                      <VersionHistory entityId={id} entityType={6} />
                    </Paper>
                  </Collapse>
                  {renderActionButtons()}
                </Box>
              </Box>
              {((post.xTweetId || post.facebookPostId) && !isEditMode) && renderSocialMetricsTable()}
              {isEditMode ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <TextField
                    label="Tiêu đề *"
                    value={editablePost?.title || ''}
                    fullWidth
                    margin="normal"
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    error={!!fieldErrors.title}
                    helperText={fieldErrors.title}
                  />
                  <Box sx={commonStyles.boxContainer}>
                    <Box sx={commonStyles.flexContainer}>
                      <FormControl fullWidth margin="normal" error={!!fieldErrors.category}>
                        <InputLabel>Danh mục *</InputLabel>
                        <Select
                          value={editablePost?.postCategoryId || ''}
                          label="Danh mục *"
                          onChange={(e) => {
                            const selectedCategory = categoryOptions.find(cat => cat.postCategoryId === e.target.value);
                            if (selectedCategory) {
                              setEditablePost(prev => ({
                                ...prev,
                                postCategoryId: selectedCategory.postCategoryId,
                                postCategoryName: selectedCategory.name
                              }));
                            }
                          }}
                        >
                          {categoryOptions.map(category => (
                            <MenuItem key={category.postCategoryId} value={category.postCategoryId}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {fieldErrors.category && (<FormHelperText>{fieldErrors.category}</FormHelperText>)}
                      </FormControl>
                    </Box>
                    <Box sx={commonStyles.flexContainer}>
                      <FormControl fullWidth margin="normal" error={!!fieldErrors.provinceId}>
                        <InputLabel>Tỉnh/Thành phố *</InputLabel>
                        <Select
                          value={editablePost?.provinceId || ''}
                          label="Tỉnh/Thành phố *"
                          onChange={(e) => {
                            const selectedProvince = provinceOptions.find(p => p.value === e.target.value);
                            if (selectedProvince) {
                              setEditablePost(prev => ({
                                ...prev,
                                provinceId: selectedProvince.value,
                                provinceName: selectedProvince.label
                              }));
                            }
                          }}
                        >
                          {provinceOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {fieldErrors.provinceId && (<FormHelperText>{fieldErrors.provinceId}</FormHelperText>)}
                      </FormControl>
                    </Box>
                  </Box>
                  <TextField
                    label="Mô tả *"
                    value={editablePost?.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    error={!!fieldErrors.description}
                    helperText={fieldErrors.description}
                  />
                  <Box sx={commonStyles.imageContainer}>
                    <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem', fontWeight: 600 }}>Ảnh *</Typography>
                    {fieldErrors.image && (
                      <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                        {fieldErrors.image}
                      </Typography>
                    )}
                    <Box sx={{
                      position: 'relative', width: '100%', height: '300px',
                      border: fieldErrors.image ? '2px dashed red' : '2px dashed #ccc', borderRadius: '8px', display: 'flex',
                      justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
                    }}>
                      {editablePost?.image ? (
                        <img src={editablePost.image} alt={editablePost.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <img src="/add-image.png" alt="Add image" style={{ width: '100px', height: '100px', opacity: 0.5 }} />
                      )}
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                          opacity: 0, transition: 'opacity 0.3s ease', '&:hover': { opacity: 1 },
                          backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000', border: '1px solid #ccc',
                        }}
                      >
                        {editablePost?.image ? 'Đổi ảnh khác' : 'Chọn ảnh cho bài viết'}
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={commonStyles.editorContainer}>
                    <Typography sx={{ ...commonStyles.labelTypography, mb: 1 }}>Nội dung *</Typography>
                    <FormControl sx={{ width: '100%' }}>
                      <ReactQuill
                        value={editablePost?.content || ''}
                        onChange={(value) => handleFieldChange('content', value)}
                        theme="snow"
                        className={fieldErrors.content ? "ql-error" : ""}
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'font': [] }],
                            [{ 'size': ['small', false, 'large', 'huge'] }], ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }], [{ 'script': 'sub' }, { 'script': 'super' }], [{ 'align': [] }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'direction': 'rtl' }], ['blockquote', 'code-block'], ['link', 'image', 'video', 'formula'], ['clean']
                          ],
                          clipboard: { matchVisual: false }
                        }}
                      />
                      {fieldErrors.content && (
                        <FormHelperText error>{fieldErrors.content}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveChanges}
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : ''}
                    >
                      {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
                    <Chip
                      label={statusInfo.text}
                      size="small"
                      sx={{ mb: 1, color: `${statusInfo.color}`, bgcolor: `${statusInfo.backgroundColor}`, fontWeight: 600 }}
                    />
                  </Box>
                  <img src={post.imageUrl} alt={post.title}
                    style={{ width: '100%', height: '25rem', objectFit: 'cover' }} />
                  <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 700, color: '#1A1A1A', mb: 3, lineHeight: 1.2, letterSpacing: '-0.02em', fontFamily: '"Tinos", serif', marginTop: 3 }}>
                    {post.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FontAwesomeIcon icon={faTag} style={{ color: '#666' }} />
                      <Chip label={post.postCategoryName} sx={{ bgcolor: '#f5f5f5', color: '#666', fontWeight: 500, '&:hover': { bgcolor: '#eeeeee' } }} />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#666' }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FontAwesomeIcon icon={faMapLocation} style={{ color: '#666' }} />
                      <Typography variant="body2" color="text.secondary">{post.provinceName}</Typography>
                    </Box>
                  </Box>

                  <Box dangerouslySetInnerHTML={{ __html: post.content }}
                    sx={{
                      '& h1': { lineHeight: 1.5, mb: -1 }, '& h2': { lineHeight: 1.5, mb: -1 }, '& h3': { lineHeight: 1.5, mb: -1 },
                      '& h4': { lineHeight: 1.5, mb: -1 }, '& h5': { lineHeight: 1.5, mb: -1 }, '& h6': { lineHeight: 1.5, mb: -1 },
                      '& img': { width: '100%', height: 'auto', borderRadius: '4px', my: 0 },
                      '& p': { lineHeight: 1.5, mb: 0 }, flexGrow: 1, width: '90%', margin: '0 auto'
                    }}
                  />
                </Box>
              )}
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
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }} > {snackbar.message} </Alert>
      </Snackbar>
      <PostDeleteConfirm
        open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)}
        postId={post.postId} onDelete={handleConfirmDelete} />
      <Dialog open={isApprovePopupOpen} onClose={() => setIsApprovePopupOpen(false)}>
        <DialogTitle>Xác nhận duyệt</DialogTitle>
        <DialogContent> <DialogContentText> Bạn có chắc chắn muốn duyệt bài viết này? </DialogContentText> </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsApprovePopupOpen(false)}>Hủy</Button>
          <Button onClick={handleApprove} variant="contained" color="primary"> Xác nhận </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isRejectPopupOpen} onClose={() => setIsRejectPopupOpen(false)}>
        <DialogTitle>Xác nhận từ chối</DialogTitle>
        <DialogContent sx={{ width: '30rem' }}>
          <DialogContentText> Vui lòng nhập lý do từ chối: </DialogContentText>
          <TextField
            autoFocus margin="dense" label="Lý do" fullWidth multiline rows={4}
            value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRejectPopupOpen(false)}>Hủy</Button>
          <Button onClick={handleReject} variant="contained" color="error" disabled={!rejectReason.trim()} > Từ chối </Button>
        </DialogActions>
      </Dialog>
      <CancelConfirmationDialog />
    </Box>
  );
};

export default ManagerPostDetail;