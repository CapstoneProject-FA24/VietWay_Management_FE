import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';

const OldTourInfo = ({ currentBooking, formatDateTime, formatPrice }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography sx={{ 
        fontWeight: 'bold', 
        fontSize: '1.1rem',
        mb: 2,
        color: 'text.secondary'
      }}>
        Thông tin tour hiện tại
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ '& > *': { mb: 1.5 } }}>
            <Typography>
              <strong>Tên tour:</strong> {currentBooking?.tour?.name}
            </Typography>
            <Typography>
              <strong>Thời gian khởi hành:</strong> {formatDateTime(currentBooking?.tour?.startDateTime)}
            </Typography>
            <Typography>
              <strong>Điểm khởi hành:</strong> {currentBooking?.tour?.departurePoint}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ '& > *': { mb: 1.5 } }}>
            <Typography>
              <strong>Thời gian kết thúc:</strong> {formatDateTime(currentBooking?.tour?.endDateTime)}
            </Typography>
            <Typography>
              <strong>Điểm đến:</strong> {currentBooking?.tour?.destination}
            </Typography>
            <Typography>
              <strong>Tổng tiền:</strong> {formatPrice(currentBooking?.totalPrice)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OldTourInfo;
