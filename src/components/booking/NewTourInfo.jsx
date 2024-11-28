import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';

const NewTourInfo = ({ newTour, formatDateTime, formatPrice }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography sx={{ 
        fontWeight: 'bold', 
        fontSize: '1.4rem',
        mb: 2,
        color: 'text.secondary',
        textAlign: 'center'
      }}>
        Thông tin tour mới
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ '& > *': { mb: 1.5 } }}>
            <Typography>
              <strong>Tên tour:</strong> {newTour?.tourName}
            </Typography>
            <Typography>
              <strong>Thời gian khởi hành:</strong> {formatDateTime(newTour?.startDate)}
            </Typography>
            <Typography>
              <strong>Điểm khởi hành:</strong> {newTour?.startLocation}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ '& > *': { mb: 1.5 } }}>
            <Typography>
              <strong>Thời lượng:</strong> {newTour?.duration}
            </Typography>
            <Typography>
              <strong>Điểm đến:</strong> {newTour?.provinces?.join(' - ')}
            </Typography>
            <Typography>
              <strong>Tổng tiền:</strong> {newTour?.totalAmount?.toLocaleString('vi-VN')}đ
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NewTourInfo;
