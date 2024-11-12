import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import FeedbackCard from '@components/manager/feedbackTour/FeedbackCard';
import { mockFeedbacks } from '@hooks/MockFeedback';

const FeedbackList = ({ tourTemplateId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      // Filter feedbacks based on tourTemplateId
      const filteredFeedbacks = mockFeedbacks.filter(
        feedback => feedback.tourTemplateId === tourTemplateId
      );
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFeedbacks(filteredFeedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tourTemplateId) {
      fetchFeedbacks();
    }
  }, [tourTemplateId]);

  const onDelete = (id) => {
    setFeedbacks(prevFeedbacks => prevFeedbacks.filter(feedback => feedback.id !== id));
  };

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
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                onDelete={onDelete}
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

export default FeedbackList;
