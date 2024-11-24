import React, { useState } from 'react';
import { Paper, Stack, Avatar, Typography, IconButton, Rating, Box, Button } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ReviewCard = ({ review, onToggleVisibility, isManager = false }) => {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        mb: 2, 
        borderRadius: 2,
        opacity: review.isHidden ? 0.6 : 1,
        position: 'relative',
        ...(review.isHidden && {
          '&::after': {
            content: '"Đã ẩn"',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            zIndex: 1
          }
        })
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={review.avatarUrl}
              sx={{
                width: 48,
                height: 48
              }}
            />
            <Stack>
              <Typography variant="subtitle1" fontWeight="bold">
                {review.reviewer}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Rating
                  value={review.rating}
                  readOnly
                  size="small"
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: 'primary.main',
                    },
                    '& .MuiRating-iconEmpty': {
                      color: 'primary.main',
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  • {formatDate(review.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          {isManager && onToggleVisibility && (
            <IconButton
              onClick={() => onToggleVisibility(review.reviewId, !review.isHidden)}
              sx={{ color: review.isHidden ? 'error.main' : 'success.main' }}
            >
              {review.isHidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          )}
        </Stack>

        <Typography variant="body1">
          {review.review}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          {review.likeCount >= 0 && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <ThumbUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {review.likeCount}
              </Typography>
            </Stack>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default ReviewCard;
