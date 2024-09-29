import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { mockTours } from '@hooks/MockTour';
import SidebarStaff from '@layouts/SidebarStaff';

const TourDetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const tour = mockTours[0];

  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: isSidebarOpen ? '250px' : 0, transition: 'margin 0.3s' }}>
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h4" gutterBottom>
            {tour.tourTemplateName}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {tour.tourName}
          </Typography>
          {/* Thêm các thông tin khác của tour ở đây */}
        </Paper>
      </Box>
    </Box>
  );
};

export default TourDetailPage;

