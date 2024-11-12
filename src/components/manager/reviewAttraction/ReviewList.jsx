import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import ReviewCard from '@components/manager/reviewAttraction/ReviewCard';
//import { getAttractionReviews } from '@services/AttractionService';

const ReviewList = ({ attractionId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize] = useState(100);
  const [pageIndex, setPageIndex] = useState(1);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getAttractionReviews(attractionId, {
        pageSize,
        pageIndex,
        isOrderedByCreatedDate: true
      });
      setReviews(response.items);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (attractionId) {
      fetchReviews();
    }
  }, [attractionId, pageIndex]);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        height: '80vh',
        overflow: 'hidden',
        p: 2,
        backgroundColor: 'transparent'
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Danh sách đánh giá
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ 
          height: 'calc(80vh - 60px)',
          overflowY: 'auto',
          pr: 2,
          mr: -2
        }}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={{
                  ...review,
                  helpful: review.likeCount,
                  date: new Date(review.createdAt).toLocaleDateString('vi-VN'),
                  userName: review.reviewer.fullName,
                  userAvatar: review.reviewer.avatarUrl
                }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
              Chưa có đánh giá nào
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default ReviewList;
