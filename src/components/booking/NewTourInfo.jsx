import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';

const NewTourInfo = ({ newTour, formatDateTime, formatPrice }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography sx={{ 
        fontWeight: 'bold', 
        fontSize: '1.1rem',
        mb: 2,
        color: 'text.secondary'
      }}>
        Thông tin tour mới
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ '& > *': { mb: 1.5 } }}>
            <Typography>
              <strong>Tên tour:</strong> {newTour?.name}
            </Typography>
            <Typography>
              <strong>Thời gian khởi hành:</strong> {formatDateTime(newTour?.startDateTime)}
            </Typography>
            <Typography>
              <strong>Điểm khởi hành:</strong> {newTour?.departurePoint}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ '& > *': { mb: 1.5 } }}>
            <Typography>
              <strong>Thời gian kết thúc:</strong> {formatDateTime(newTour?.endDateTime)}
            </Typography>
            <Typography>
              <strong>Điểm đến:</strong> {newTour?.destination}
            </Typography>
            <Typography>
              <strong>Tổng tiền:</strong> {formatPrice(newTour?.totalPrice)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NewTourInfo;
