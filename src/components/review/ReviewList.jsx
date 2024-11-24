import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Typography, Chip, Menu, MenuItem, CircularProgress, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert, TextField } from '@mui/material';
import ReviewCard from '@components/review/ReviewCard';
import ReviewBreakdown from '@components/review/ReviewBreakdown';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getAttractionReviews, toggleReviewVisibility } from '@services/AttractionService';
import { getCookie } from '@services/AuthenService';

const ReviewList = ({ attractionId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [sortBy, setSortBy] = useState('helpful');
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [anchorEl, setAnchorEl] = useState(null);
  const [pageSize] = useState(100);
  const [pageIndex, setPageIndex] = useState(1);
  const [isApiError, setIsApiError] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    reviewId: null,
    shouldHide: false,
    reason: ''
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getAttractionReviews(attractionId, {
        pageSize,
        pageIndex,
        isOrderedByLikeNumber: sortBy === 'helpful',
        isOrderedByCreatedDate: sortBy === 'date',
        ratingValues: selectedRatings.length > 0 ? selectedRatings : undefined
      });
      
      const mappedReviews = response.items.map(review => ({
        reviewId: review.reviewId,
        rating: review.rating,
        review: review.review,
        createdAt: review.createdAt,
        reviewer: review.reviewer,
        avatarUrl: review.reviewer.avatarUrl,
        likeCount: review.likeCount,
        isHidden: review.isDeleted
      }));
      
      setReviews(mappedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setIsApiError(true);
      setNotificationMessage('Không thể tải đánh giá. Vui lòng thử lại sau');
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (attractionId) {
      fetchReviews();
    }
  }, [attractionId, selectedRatings, sortBy, pageIndex]);

  const handleRatingFilter = (rating) => {
    const newRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(newRatings);
    setPageIndex(1);
  };

  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setPageIndex(1);
    handleSortMenuClose();
  };

  const loadMoreReviews = () => {
    setVisibleReviews(prevVisible => prevVisible + 5);
  };

  const closeAdditionalReviews = () => {
    setVisibleReviews(3);
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
  };

  const handleToggleVisibility = (reviewId, shouldHide) => {
    setConfirmDialog({
      open: true,
      reviewId,
      shouldHide,
      reason: ''
    });
  };

  const handleConfirmToggleVisibility = async () => {
    try {
      await toggleReviewVisibility(
        confirmDialog.reviewId, 
        confirmDialog.shouldHide,
        confirmDialog.reason
      );
      
      setNotificationMessage(confirmDialog.shouldHide ? 'Đã ẩn đánh giá' : 'Đã hiện đánh giá');
      setIsApiError(false);
      setShowNotification(true);
      await fetchReviews();
    } catch (error) {
      console.error('Error toggling review visibility:', error);
      setIsApiError(true);
      setNotificationMessage('Không thể thực hiện. Vui lòng thử lại sau');
      setShowNotification(true);
    } finally {
      setConfirmDialog({ open: false, reviewId: null, shouldHide: false, reason: '' });
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <ReviewBreakdown reviews={reviews} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant="h5" fontWeight="bold" mb={2}>Lọc theo đánh giá</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              {[5, 4, 3, 2, 1].map(rating => (
                <Chip
                  key={rating}
                  label={`${rating} sao`}
                  onClick={() => handleRatingFilter(rating)}
                  color={selectedRatings.includes(rating) ? 'primary' : 'default'}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            <Button
              startIcon={<FilterListIcon />}
              onClick={handleSortMenuOpen}
            >
              {sortBy === 'helpful' ? 'Hữu ích nhất' : 'Gần đây'}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSortMenuClose}
            >
              <MenuItem onClick={() => handleSortChange('helpful')}>Hữu ích nhất</MenuItem>
              <MenuItem onClick={() => handleSortChange('date')}>Gần đây</MenuItem>
            </Menu>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {reviews.slice(0, visibleReviews).map((review) => (
                <ReviewCard
                  key={review.reviewId}
                  review={{
                    reviewId: review.reviewId,
                    rating: review.rating,
                    review: review.review,
                    createdAt: review.createdAt,
                    reviewer: review.reviewer,
                    avatarUrl: review.avatarUrl,
                    likeCount: review.likeCount,
                    isHidden: review.isHidden
                  }}
                  onToggleVisibility={getCookie('role') === 'quan-ly' ? handleToggleVisibility : undefined}
                  isManager={getCookie('role') === 'quan-ly'}
                />
              ))}

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
                {visibleReviews < reviews.length && (
                  <Button
                    variant="outlined"
                    onClick={loadMoreReviews}
                    sx={{ textTransform: 'none' }}
                  >
                    Xem thêm đánh giá
                  </Button>
                )}
                {visibleReviews > 3 && (
                  <Button
                    variant="outlined"
                    onClick={closeAdditionalReviews}
                    sx={{ textTransform: 'none' }}
                  >
                    Đóng bớt đánh giá
                  </Button>
                )}
              </Box>

              {visibleReviews >= reviews.length && reviews.length > 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
                  Đã hiển thị tất cả đánh giá
                </Typography>
              )}
              {reviews.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
                  Không có đánh giá nào phù hợp với bộ lọc
                </Typography>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {getCookie('role') === 'quan-ly' && (
        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        >
          <DialogTitle>
            {confirmDialog.shouldHide ? 'Xác nhận ẩn đánh giá' : 'Xác nhận hiện đánh giá'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {confirmDialog.shouldHide 
                ? 'Bạn có chắc chắn muốn ẩn đánh giá này?' 
                : 'Bạn có chắc chắn muốn hiện đánh giá này?'
              }
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Lý do"
              fullWidth
              variant="outlined"
              value={confirmDialog.reason}
              onChange={(e) => setConfirmDialog({ ...confirmDialog, reason: e.target.value })}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
              color="inherit"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleConfirmToggleVisibility}
              variant="contained"
              color={confirmDialog.shouldHide ? "error" : "primary"}
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={showNotification}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={isApiError ? "error" : "success"}
          variant="filled" sx={{ width: '100%' }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ReviewList;
