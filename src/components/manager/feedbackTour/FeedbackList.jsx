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
      const filteredFeedbacks = mockFeedbacks.filter(
        feedback => feedback.tourTemplateId === String(tourTemplateId)
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFeedbacks(filteredFeedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [tourTemplateId]);

  const onDelete = (id) => {
    setFeedbacks(prevFeedbacks => prevFeedbacks.filter(feedback => feedback.id !== id));
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        height: 'auto',
        maxHeight: '80vh',
        overflow: 'hidden',
        p: 2,
        backgroundColor: 'transparent'
      }}
    >
      <Box sx={{ 
        overflowY: 'auto',
        pr: 2,
        mr: -2
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <Typography variant="body1" color="text.secondary" alignSelf="center" mt={2}>
                Chưa có đánh giá nào
              </Typography>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
};

export default FeedbackList;
