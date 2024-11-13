import React, { useMemo } from 'react';
import { Box, Typography, LinearProgress, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const FeedbackBreakdown = ({ reviews }) => {
  const { totalReviews, averageRating, ratingCounts } = useMemo(() => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;
    
    // Initialize rating counts
    const ratingCounts = {
      5: 0, // Tuyệt vời
      4: 0, // Tốt
      3: 0, // Khá tốt
      2: 0, // Tệ
      1: 0  // Rất tệ
    };
    
    // Count ratings
    reviews.forEach(review => {
      ratingCounts[review.rating]++;
    });

    return { totalReviews, averageRating, ratingCounts };
  }, [reviews]);

  const ratingLabels = {
    5: 'Tuyệt vời',
    4: 'Tốt',
    3: 'Khá tốt',
    2: 'Tệ',
    1: 'Rất tệ'
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight="bold">
          {averageRating.toFixed(1)}
        </Typography>
        <Stack>
          <Rating value={averageRating} readOnly precision={0.5} />
          <Typography variant="body2" color="text.secondary">
            {totalReviews} đánh giá
          </Typography>
        </Stack>
      </Stack>

      {Object.entries(ratingLabels).reverse().map(([rating, label]) => (
        <Box key={rating} sx={{ mb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">{label}</Typography>
            <Typography variant="body2" color="text.secondary">
              {ratingCounts[rating]}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(ratingCounts[rating] / totalReviews) * 100 || 0}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main'
              }
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default FeedbackBreakdown;
