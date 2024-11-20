import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip, CircularProgress } from '@mui/material';
import { ArrowBack, Delete } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import SidebarManager from '@layouts/SidebarManager';
import { fetchPostById, deletePost, sharePostOnFacebook, sharePostOnTwitter, getTwitterReactionsByPostId, changePostStatus, getFacebookReactionsByPostId } from '@services/PostService';
import { getPostStatusInfo } from '@services/StatusService';
import 'react-quill/dist/quill.snow.css';
import { PostStatus } from '@hooks/Statuses';
import PostDeleteConfirm from '@components/post/PostDeleteConfirm';
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
  const [isApprovePopupOpen, setIsApprovePopupOpen] = useState(false);
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [socialMetrics, setSocialMetrics] = useState({
    twitter: null,
    facebook: null
  });
  const [isPublishing, setIsPublishing] = useState({
    facebook: false,
    twitter: false
  });

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

  useEffect(() => {
    const fetchTwitterReactions = async () => {
      if (post?.xTweetId) {
        try {
          const data = await getTwitterReactionsByPostId(post.postId);
          if (data) {
            setSocialMetrics(prev => ({
              ...prev,
              twitter: {
                likeCount: data.likeCount,
                retweetCount: data.retweetCount,
                replyCount: data.replyCount,
                impressionCount: data.impressionCount,
                quoteCount: data.quoteCount,
                bookmarkCount: data.bookmarkCount
              }
            }));
          }
        } catch (error) {
          console.error('Error fetching Twitter reactions:', error);
          setSocialMetrics(prev => ({
            ...prev,
            twitter: {
              likeCount: 0,
              retweetCount: 0,
              replyCount: 0,
              impressionCount: 0,
              quoteCount: 0,
              bookmarkCount: 0
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
                reactionCount: totalReactions,
                reactionDetails: data.postReactions || {},
                shareCount: data.shareCount,
                commentCount: data.commentCount,
                impressionCount: data.impressionCount
              }
            }));
          }
        } catch (error) {
          console.error('Error fetching Facebook reactions:', error);
          setSnackbar({
            open: true,
            message: 'Không thể tải thông tin tương tác Facebook',
            severity: 'error'
          });
        }
      }
    };

    fetchFacebookReactions();
    const interval = setInterval(fetchFacebookReactions, 30000);
    return () => clearInterval(interval);
  }, [post?.postId, post?.facebookPostId]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleApprove = async () => {
    try {
      await changePostStatus(post.postId, 2);
      setPost({ ...post, status: 2 });
      setSnackbar({
        open: true,
        message: 'Bài viết đã được duyệt',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi duyệt bài viết',
        severity: 'error'
      });
    } finally {
      setIsApprovePopupOpen(false);
    }
  };

  const handleReject = async () => {
    try {
      await changePostStatus(post.postId, 3, rejectReason);
      setPost({ ...post, status: 3 });
      setSnackbar({
        open: true,
        message: 'Bài viết đã bị từ chối',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi từ chối bài viết',
        severity: 'error'
      });
    } finally {
      setIsRejectPopupOpen(false);
      setRejectReason('');
    }
  };

  const renderActionButtons = () => {
    switch (post.status) {
      case PostStatus.Pending:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Button
              variant="contained"
              sx={{ width: 'fit-content', pl: 2, pr: 2, backgroundColor: 'primary.main' }}
              onClick={() => setIsApprovePopupOpen(true)}
            >
              Duyệt
            </Button>
            <Button
              variant="contained"
              sx={{ width: 'fit-content', pl: 2, pr: 2, backgroundColor: 'red' }}
              onClick={() => setIsRejectPopupOpen(true)}
            >
              Từ chối
            </Button>
          </Box>
        );
      case PostStatus.Approved:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <Button variant="contained" color="error" startIcon={<Delete />} onClick={handleDeletePost} sx={{ height: 'fit-content' }}>
              Xóa
            </Button>
            {(!post.xTweetId || !post.facebookPostId) && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography>Đăng bài:</Typography>
                {!post.facebookPostId && (
                  <Button 
                    variant="contained" 
                    startIcon={isPublishing.facebook ? <CircularProgress size={20} color="inherit" /> : <FacebookIcon />}
                    onClick={() => handleShareToSocial('facebook')}
                    disabled={isPublishing.facebook}
                    sx={{ backgroundColor: '#1877F2', height: 'fit-content', '&:hover': { backgroundColor: '#0d6efd' } }}
                  >
                    {isPublishing.facebook ? 'Đang đăng...' : 'Facebook'}
                  </Button>
                )}
                {!post.xTweetId && (
                  <Button 
                    variant="contained" 
                    startIcon={isPublishing.twitter ? <CircularProgress size={20} color="inherit" /> : <XIcon />}
                    onClick={() => handleShareToSocial('twitter')}
                    disabled={isPublishing.twitter}
                    sx={{ backgroundColor: '#000000', '&:hover': { backgroundColor: '#2c2c2c' } }}
                  >
                    {isPublishing.twitter ? 'Đang đăng...' : 'Twitter'}
                  </Button>
                )}
              </Box>
            )}
            {(post.xTweetId || post.facebookPostId) && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography>Xem bài đã đăng tại:</Typography>
                  {post.facebookPostId && (
                    <Button
                      variant="contained"
                      startIcon={<FacebookIcon />}
                      onClick={() => handleViewOnSocial('facebook')}
                      sx={{ backgroundColor: '#1877F2', height: 'fit-content', '&:hover': { backgroundColor: '#0d6efd' } }}
                    >
                      Facebook
                    </Button>
                  )}
                  {post.xTweetId && (
                    <Button
                      variant="contained"
                      startIcon={<XIcon />}
                      onClick={() => handleViewOnSocial('twitter')}
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

  const handleShareToSocial = async (platform) => {
    setIsPublishing(prev => ({ ...prev, [platform]: true }));
    try {
      if (platform === 'facebook') {
        await sharePostOnFacebook(post.postId);
        setSnackbar({
          open: true,
          message: 'Đã đăng bài viết lên Facebook thành công',
          severity: 'success'
        });
      } else if (platform === 'twitter') {
        await sharePostOnTwitter(post.postId);
        setSnackbar({
          open: true,
          message: 'Đã đăng bài viết lên Twitter thành công',
          severity: 'success'
        });
      }
      const updatedPost = await fetchPostById(post.postId);
      setPost(updatedPost);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Lỗi khi đăng bài lên ${platform === 'facebook' ? 'Facebook' : 'Twitter'}: ${error.response?.data?.message || error.message}`,
        severity: 'error'
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <XIcon sx={{ fontSize: 20 }} />
                  Twitter
                </Box>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FacebookIcon sx={{ fontSize: 20 }} />
                  Facebook
                </Box>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={
                  <Box>
                    {Object.entries(socialMetrics.facebook.reactionDetails).map(([type, count]) => (
                      <Typography key={type} variant="body2">
                        {type}: {count}
                      </Typography>
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
                <>
                  <TableCell align="center">-</TableCell>
                  <TableCell align="center">-</TableCell>
                </>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );

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
              {(post.xTweetId || post.facebookPostId) && renderSocialMetricsTable()}
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
      <Dialog open={isApprovePopupOpen} onClose={() => setIsApprovePopupOpen(false)}>
        <DialogTitle>Xác nhận duyệt</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn duyệt bài viết này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsApprovePopupOpen(false)}>Hủy</Button>
          <Button onClick={handleApprove} variant="contained" color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isRejectPopupOpen} onClose={() => setIsRejectPopupOpen(false)}>
        <DialogTitle>Xác nhận từ chối</DialogTitle>
        <DialogContent sx={{ width: '30rem' }}>
          <DialogContentText>
            Vui lòng nhập lý do từ chối:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRejectPopupOpen(false)}>Hủy</Button>
          <Button
            onClick={handleReject}
            variant="contained"
            color="error"
            disabled={!rejectReason.trim()}
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerPostDetail;
