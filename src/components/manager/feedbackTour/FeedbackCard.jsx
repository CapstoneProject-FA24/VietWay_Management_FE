import React from 'react';
import { Paper, Stack, Avatar, Typography, Rating } from '@mui/material';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

const FeedbackCard = ({ feedback, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  return (
    <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'primary.main'
              }}
            >
              {feedback.customerName.charAt(0)}
            </Avatar>
            <Stack>
              <Typography variant="subtitle1" fontWeight="bold">
                {feedback.customerName}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Rating
                  value={feedback.rating}
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
                  • {formatDate(feedback.createDate)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            size="small"
            onClick={() => onDelete(feedback.id)}
          >
            Xóa
          </Button>
        </Stack>

        <Typography variant="body1">
          {feedback.feedback}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Ngày khởi hành: {formatDate(feedback.startDate)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default FeedbackCard;
